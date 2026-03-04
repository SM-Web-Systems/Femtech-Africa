// ============================================
// AUTH SERVICE - DATA ACCESS PATTERNS
// ============================================

import {
  BaseService,
  ServiceDependencies,
  ServiceContext,
  ServiceError,
} from '@momentum/shared/services';
import { UserRepository, UserWithProfile } from '../repositories/user.repository';
import { OtpRepository } from '../repositories/otp.repository';
import { SessionRepository } from '../repositories/session.repository';
import { ConsentRepository } from '../repositories/consent.repository';
import { EncryptionService } from './encryption.service';
import { SmsService } from './sms.service';
import { JwtService, TokenPair } from './jwt.service';
import {
  User,
  UserStatus,
  CountryCode,
  LanguageCode,
  ConsentType,
  OtpPurpose,
} from '@momentum/prisma-client';

// ============================================
// INTERFACES
// ============================================

export interface RegisterInput {
  phone: string;
  country: CountryCode;
  language?: LanguageCode;
  firstName?: string;
  lastName?: string;
  consents: ConsentType[];
}

export interface VerifyOtpInput {
  phone: string;
  code: string;
  purpose: OtpPurpose;
  deviceId: string;
  deviceType: string;
  deviceName?: string;
}

export interface LoginInput {
  phone: string;
  deviceId: string;
  deviceType: string;
  deviceName?: string;
}

export interface AuthResult {
  user: UserWithProfile;
  tokens: TokenPair;
  isNewUser: boolean;
}

// ============================================
// SERVICE IMPLEMENTATION
// ============================================

export class AuthService extends BaseService {
  private userRepo: UserRepository;
  private otpRepo: OtpRepository;
  private sessionRepo: SessionRepository;
  private consentRepo: ConsentRepository;
  private encryption: EncryptionService;
  private sms: SmsService;
  private jwt: JwtService;

  constructor(
    deps: ServiceDependencies,
    encryption: EncryptionService,
    sms: SmsService,
    jwt: JwtService
  ) {
    super(deps);
    
    this.userRepo = new UserRepository({
      prisma: deps.prisma,
      logger: deps.logger,
      cache: deps.cache,
      eventBus: deps.eventBus,
    });
    this.otpRepo = new OtpRepository({ prisma: deps.prisma, logger: deps.logger });
    this.sessionRepo = new SessionRepository({ prisma: deps.prisma, logger: deps.logger });
    this.consentRepo = new ConsentRepository({ prisma: deps.prisma, logger: deps.logger });
    
    this.encryption = encryption;
    this.sms = sms;
    this.jwt = jwt;
  }

  // ============================================
  // REGISTRATION FLOW
  // ============================================

  /**
   * Step 1: Initiate registration - send OTP
   * Pattern: Check existence → Generate OTP → Send SMS → Store OTP
   */
  async initiateRegistration(
    input: RegisterInput,
    context: ServiceContext
  ): Promise<{ otpSent: boolean; expiresIn: number }> {
    this.logger.info({ phone: input.phone, country: input.country }, 'Initiating registration');

    // Check if user exists
    const existingUser = await this.userRepo.findByPhone(input.phone);
    
    if (existingUser?.status === 'active') {
      throw new ServiceError(
        'CONFLICT',
        'Phone number already registered',
        null,
        { phone: input.phone }
      );
    }

    // Generate and store OTP
    const otp = await this.otpRepo.createOtp({
      phone: input.phone,
      purpose: 'registration',
      userId: existingUser?.id,
    });

    // Send SMS (fire and forget with retry)
    await this.sms.sendOtp(input.phone, otp.code, input.country);

    // Store registration intent in cache for step 2
    await this.cache.set(
      `registration:${input.phone}`,
      {
        ...input,
        initiatedAt: new Date().toISOString(),
      },
      600 // 10 minutes
    );

    await this.publishEvent('auth.registration.initiated', {
      phone: input.phone,
      country: input.country,
    }, context);

    return {
      otpSent: true,
      expiresIn: 300, // 5 minutes
    };
  }

  /**
   * Step 2: Verify OTP and complete registration
   * Pattern: Validate OTP → Create/Update User → Create Profile → Record Consents → Create Session → Issue Tokens
   */
  async completeRegistration(
    input: VerifyOtpInput,
    context: ServiceContext
  ): Promise<AuthResult> {
    this.logger.info({ phone: input.phone }, 'Completing registration');

    // Verify OTP
    const isValid = await this.otpRepo.verifyOtp({
      phone: input.phone,
      code: input.code,
      purpose: 'registration',
    });

    if (!isValid) {
      throw new ServiceError('VALIDATION_ERROR', 'Invalid or expired OTP');
    }

    // Get registration data from cache
    const registrationData = await this.cache.get<RegisterInput>(
      `registration:${input.phone}`
    );

    if (!registrationData) {
      throw new ServiceError('VALIDATION_ERROR', 'Registration session expired');
    }

    // Transaction: Create user, profile, consents, session
    const result = await this.withTransaction(async (tx) => {
      // Create or update user
      let user = await this.userRepo.findByPhone(input.phone);
      let isNewUser = false;

      if (!user) {
        isNewUser = true;
        
        // Encrypt PII if provided
        let profileData;
        if (registrationData.firstName || registrationData.lastName) {
          const keyId = await this.encryption.getCurrentKeyId();
          profileData = {
            firstNameEncrypted: registrationData.firstName
              ? await this.encryption.encrypt(registrationData.firstName)
              : Buffer.from(''),
            lastNameEncrypted: registrationData.lastName
              ? await this.encryption.encrypt(registrationData.lastName)
              : Buffer.from(''),
            encryptionKeyId: keyId,
          };
        }

        user = await this.userRepo.createWithProfile(
          {
            phone: input.phone,
            country: registrationData.country,
            language: registrationData.language,
          },
          profileData
        );
      }

      // Update verification status
      user = await this.userRepo.update(user.id, {
        phoneVerified: true,
        status: 'active',
        lastLoginAt: new Date(),
      }) as UserWithProfile;

      // Record consents
      for (const consentType of registrationData.consents) {
        await this.consentRepo.grantConsent({
          userId: user.id,
          consentType,
          version: '1.0',
          ipAddress: context.ip,
        });
      }

      // Create session
      const session = await this.sessionRepo.createSession({
        userId: user.id,
        deviceId: input.deviceId,
        deviceType: input.deviceType,
        deviceName: input.deviceName,
        ipAddress: context.ip,
      });

      // Generate tokens
      const tokens = await this.jwt.generateTokenPair({
        userId: user.id,
        sessionId: session.id,
        role: user.role,
        country: user.country,
      });

      // Update session with refresh token hash
      await this.sessionRepo.setRefreshToken(session.id, tokens.refreshToken);

      return { user, tokens, isNewUser };
    });

    // Cleanup
    await this.cache.del(`registration:${input.phone}`);
    await this.otpRepo.markUsed(input.phone, 'registration');

    // Publish event
    await this.publishEvent(
      result.isNewUser ? 'auth.user.registered' : 'auth.user.verified',
      {
        userId: result.user.id,
        phone: input.phone,
        country: registrationData.country,
      },
      context
    );

    return result;
  }

  // ============================================
  // LOGIN FLOW
  // ============================================

  /**
   * Step 1: Request login OTP
   * Pattern: Find user → Validate status → Generate OTP → Send SMS
   */
  async requestLoginOtp(
    phone: string,
    context: ServiceContext
  ): Promise<{ otpSent: boolean; expiresIn: number }> {
    this.logger.info({ phone }, 'Login OTP requested');

    const user = await this.userRepo.findByPhone(phone);

    if (!user) {
      // Don't reveal if user exists - send fake success
      this.logger.warn({ phone }, 'Login attempt for non-existent user');
      return { otpSent: true, expiresIn: 300 };
    }

    if (user.status === 'suspended') {
      throw new ServiceError('FORBIDDEN', 'Account suspended');
    }

    if (user.status === 'deactivated') {
      throw new ServiceError('FORBIDDEN', 'Account deactivated');
    }

    // Rate limiting check
    const rateLimitKey = `login:ratelimit:${phone}`;
    const attempts = await this.cache.get<number>(rateLimitKey) || 0;
    
    if (attempts >= 5) {
      throw new ServiceError('RATE_LIMITED', 'Too many login attempts');
    }

    await this.cache.set(rateLimitKey, attempts + 1, 900); // 15 minutes

    // Generate and send OTP
    const otp = await this.otpRepo.createOtp({
      phone,
      purpose: 'login',
      userId: user.id,
    });

    await this.sms.sendOtp(phone, otp.code, user.country);

    return { otpSent: true, expiresIn: 300 };
  }

  /**
   * Step 2: Verify login OTP
   * Pattern: Validate OTP → Update user → Create session → Issue tokens
   */
  async verifyLogin(
    input: VerifyOtpInput,
    context: ServiceContext
  ): Promise<AuthResult> {
    this.logger.info({ phone: input.phone }, 'Verifying login');

    // Verify OTP
    const isValid = await this.otpRepo.verifyOtp({
      phone: input.phone,
      code: input.code,
      purpose: 'login',
    });

    if (!isValid) {
      throw new ServiceError('VALIDATION_ERROR', 'Invalid or expired OTP');
    }

    const user = await this.userRepo.findByPhone(input.phone);

    if (!user) {
      throw new ServiceError('NOT_FOUND', 'User not found');
    }

    // Update last login
    await this.userRepo.update(user.id, {
      lastLoginAt: new Date(),
    });

    // Create session
    const session = await this.sessionRepo.createSession({
      userId: user.id,
      deviceId: input.deviceId,
      deviceType: input.deviceType,
      deviceName: input.deviceName,
      ipAddress: context.ip,
    });

    // Generate tokens
    const tokens = await this.jwt.generateTokenPair({
      userId: user.id,
      sessionId: session.id,
      role: user.role,
      country: user.country,
    });

    await this.sessionRepo.setRefreshToken(session.id, tokens.refreshToken);

    // Clear rate limit
    await this.cache.del(`login:ratelimit:${input.phone}`);
    await this.otpRepo.markUsed(input.phone, 'login');

    await this.publishEvent('auth.user.logged_in', {
      userId: user.id,
      deviceId: input.deviceId,
      deviceType: input.deviceType,
    }, context);

    return { user, tokens, isNewUser: false };
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  /**
   * Refresh access token
   * Pattern: Validate refresh token → Check session → Issue new tokens
   */
  async refreshTokens(
    refreshToken: string,
    context: ServiceContext
  ): Promise<TokenPair> {
    // Verify refresh token
    const payload = await this.jwt.verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new ServiceError('UNAUTHORIZED', 'Invalid refresh token');
    }

    // Check session exists and is valid
    const session = await this.sessionRepo.findById(payload.sessionId);

    if (!session || session.expiresAt < new Date()) {
      throw new ServiceError('UNAUTHORIZED', 'Session expired');
    }

    // Verify refresh token matches
    const isValidToken = await this.sessionRepo.verifyRefreshToken(
      session.id,
      refreshToken
    );

    if (!isValidToken) {
      // Potential token reuse attack - invalidate all sessions
      this.logger.warn({ userId: payload.userId }, 'Potential token reuse detected');
      await this.sessionRepo.invalidateAllForUser(payload.userId);
      throw new ServiceError('UNAUTHORIZED', 'Invalid refresh token');
    }

    // Generate new tokens
    const tokens = await this.jwt.generateTokenPair({
      userId: payload.userId,
      sessionId: session.id,
      role: payload.role,
      country: payload.country,
    });

    // Update session
    await this.sessionRepo.setRefreshToken(session.id, tokens.refreshToken);
    await this.sessionRepo.updateLastActive(session.id);

    return tokens;
  }

  /**
   * Logout - invalidate session
   */
  async logout(
    sessionId: string,
    context: ServiceContext
  ): Promise<void> {
    await this.sessionRepo.invalidate(sessionId);

    await this.publishEvent('auth.user.logged_out', {
      sessionId,
      userId: context.userId,
    }, context);
  }

  /**
   * Logout all devices
   */
  async logoutAllDevices(
    userId: string,
    context: ServiceContext
  ): Promise<{ invalidatedCount: number }> {
    const count = await this.sessionRepo.invalidateAllForUser(userId);

    await this.publishEvent('auth.user.logged_out_all', {
      userId,
      invalidatedCount: count,
    }, context);

    return { invalidatedCount: count };
  }

  // ============================================
  // USER QUERIES
  // ============================================

  /**
   * Get user by ID with caching
   */
  async getUserById(
    userId: string,
    context: ServiceContext
  ): Promise<UserWithProfile | null> {
    return this.withCache(
      `user:${userId}`,
      300,
      () => this.userRepo.findById(userId) as Promise<UserWithProfile | null>
    );
  }

  /**
   * Get current user's sessions
   */
  async getUserSessions(
    userId: string,
    context: ServiceContext
  ): Promise<{ sessions: any[]; currentSessionId?: string }> {
    const sessions = await this.sessionRepo.findActiveByUser(userId);

    return {
      sessions: sessions.map(s => ({
        id: s.id,
        deviceType: s.deviceType,
        deviceName: s.deviceName,
        lastActiveAt: s.lastActiveAt,
        createdAt: s.createdAt,
        isCurrent: s.id === context.requestId, // Assuming requestId contains sessionId
      })),
    };
  }

  // ============================================
  // CONSENT MANAGEMENT
  // ============================================

  async getConsents(
    userId: string
  ): Promise<{ type: ConsentType; granted: boolean; version: string; grantedAt?: Date }[]> {
    return this.consentRepo.getConsentStatus(userId);
  }

  async updateConsent(
    userId: string,
    consentType: ConsentType,
    granted: boolean,
    context: ServiceContext
  ): Promise<void> {
    if (granted) {
      await this.consentRepo.grantConsent({
        userId,
        consentType,
        version: '1.0',
        ipAddress: context.ip,
      });
    } else {
      await this.consentRepo.revokeConsent(userId, consentType);
    }

    await this.publishEvent('auth.consent.updated', {
      userId,
      consentType,
      granted,
    }, context);
  }
}
