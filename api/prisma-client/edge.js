
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  detectRuntime,
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.10.0
 * Query Engine version: 5a9203d0590c951969e85a7d07215503f4672eb9
 */
Prisma.prismaVersion = {
  client: "5.10.0",
  engine: "5a9203d0590c951969e85a7d07215503f4672eb9"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  phone: 'phone',
  phoneVerified: 'phoneVerified',
  phone_verified_at: 'phone_verified_at',
  country: 'country',
  language: 'language',
  status: 'status',
  role: 'role',
  walletAddress: 'walletAddress',
  walletCreatedAt: 'walletCreatedAt',
  lastLoginAt: 'lastLoginAt',
  login_count: 'login_count',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  firstNameEncrypted: 'firstNameEncrypted',
  lastNameEncrypted: 'lastNameEncrypted',
  dateOfBirthEncrypted: 'dateOfBirthEncrypted',
  avatarUrl: 'avatarUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConsentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  consentType: 'consentType',
  version: 'version',
  granted: 'granted',
  grantedAt: 'grantedAt',
  revokedAt: 'revokedAt',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  deviceId: 'deviceId',
  device_info: 'device_info',
  ipAddress: 'ipAddress',
  refreshTokenHash: 'refreshTokenHash',
  expiresAt: 'expiresAt',
  last_used_at: 'last_used_at',
  createdAt: 'createdAt'
};

exports.Prisma.OtpCodeScalarFieldEnum = {
  id: 'id',
  phone: 'phone',
  codeHash: 'codeHash',
  purpose: 'purpose',
  attempts: 'attempts',
  maxAttempts: 'maxAttempts',
  expiresAt: 'expiresAt',
  verified_at: 'verified_at',
  createdAt: 'createdAt'
};

exports.Prisma.FacilityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  address: 'address',
  city: 'city',
  country: 'country',
  latitude: 'latitude',
  longitude: 'longitude',
  phone: 'phone',
  email: 'email',
  website: 'website',
  operatingHours: 'operatingHours',
  isPartner: 'isPartner',
  partner_since: 'partner_since',
  accepts_tokens: 'accepts_tokens',
  verificationCode: 'verificationCode',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PregnancyScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  status: 'status',
  last_period_date: 'last_period_date',
  estimated_due_date: 'estimated_due_date',
  conceptionDate: 'conceptionDate',
  actual_delivery_date: 'actual_delivery_date',
  gravida: 'gravida',
  parity: 'parity',
  isHighRisk: 'isHighRisk',
  riskFactors: 'riskFactors',
  risk_score: 'risk_score',
  bloodType: 'bloodType',
  primaryFacilityId: 'primaryFacilityId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MedicalHistoryScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  pregnancyId: 'pregnancyId',
  conditionType: 'conditionType',
  condition_code: 'condition_code',
  condition_name: 'condition_name',
  status: 'status',
  diagnosedDate: 'diagnosedDate',
  resolved_date: 'resolved_date',
  notesEncrypted: 'notesEncrypted',
  verifiedBy: 'verifiedBy',
  verifiedAt: 'verifiedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  pregnancyId: 'pregnancyId',
  facilityId: 'facilityId',
  appointment_type: 'appointment_type',
  status: 'status',
  scheduled_at: 'scheduled_at',
  duration_minutes: 'duration_minutes',
  reminder_sent_at: 'reminder_sent_at',
  completed_at: 'completed_at',
  verified_at: 'verified_at',
  verifiedBy: 'verifiedBy',
  verification_code: 'verification_code',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.KickSessionScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  pregnancyId: 'pregnancyId',
  start_time: 'start_time',
  end_time: 'end_time',
  kickCount: 'kickCount',
  target_count: 'target_count',
  durationMinutes: 'durationMinutes',
  notes: 'notes',
  alertTriggered: 'alertTriggered',
  alert_reason: 'alert_reason',
  createdAt: 'createdAt'
};

exports.Prisma.EmergencyContactScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  name: 'name',
  relationship: 'relationship',
  phone: 'phone',
  priority: 'priority',
  is_active: 'is_active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MilestoneDefinitionScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  icon: 'icon',
  category: 'category',
  country: 'country',
  rewardAmount: 'rewardAmount',
  maxClaimsPerPregnancy: 'maxClaimsPerPregnancy',
  requiresVerification: 'requiresVerification',
  verificationTypes: 'verificationTypes',
  gestationalWeekMin: 'gestationalWeekMin',
  gestationalWeekMax: 'gestationalWeekMax',
  days_to_complete: 'days_to_complete',
  prerequisite_milestones: 'prerequisite_milestones',
  isActive: 'isActive',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserMilestoneScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  pregnancyId: 'pregnancyId',
  milestone_def_id: 'milestone_def_id',
  status: 'status',
  progress: 'progress',
  progressData: 'progressData',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  expiresAt: 'expiresAt',
  rewardAmount: 'rewardAmount',
  reward_minted: 'reward_minted',
  reward_tx_hash: 'reward_tx_hash',
  reward_minted_at: 'reward_minted_at',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VerifierScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  facilityId: 'facilityId',
  verifier_type: 'verifier_type',
  verificationCode: 'verificationCode',
  name: 'name',
  credential_number: 'credential_number',
  credential_verified: 'credential_verified',
  total_verifications: 'total_verifications',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VerificationScalarFieldEnum = {
  id: 'id',
  userMilestoneId: 'userMilestoneId',
  verifierId: 'verifierId',
  verificationType: 'verificationType',
  verificationHash: 'verificationHash',
  qrCodeData: 'qrCodeData',
  signature: 'signature',
  metadata: 'metadata',
  latitude: 'latitude',
  longitude: 'longitude',
  verified_at: 'verified_at',
  createdAt: 'createdAt'
};

exports.Prisma.TokenTransactionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  status: 'status',
  amount: 'amount',
  tx_hash: 'tx_hash',
  stellar_tx_id: 'stellar_tx_id',
  milestoneId: 'milestoneId',
  redemptionId: 'redemptionId',
  errorMessage: 'errorMessage',
  retryCount: 'retryCount',
  processed_at: 'processed_at',
  createdAt: 'createdAt'
};

exports.Prisma.PartnerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  country: 'country',
  logoUrl: 'logoUrl',
  description: 'description',
  api_endpoint: 'api_endpoint',
  apiKeyEncrypted: 'apiKeyEncrypted',
  webhookUrl: 'webhookUrl',
  config: 'config',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PartnerProductScalarFieldEnum = {
  id: 'id',
  partnerId: 'partnerId',
  name: 'name',
  description: 'description',
  category: 'category',
  tokenCost: 'tokenCost',
  external_product_id: 'external_product_id',
  imageUrl: 'imageUrl',
  is_available: 'is_available',
  stockQuantity: 'stockQuantity',
  max_per_user_daily: 'max_per_user_daily',
  max_per_user_monthly: 'max_per_user_monthly',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RedemptionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  partner_id: 'partner_id',
  type: 'type',
  totalTokens: 'totalTokens',
  status: 'status',
  external_ref: 'external_ref',
  disbursement_ref: 'disbursement_ref',
  recipient_phone: 'recipient_phone',
  recipient_name: 'recipient_name',
  burn_tx_hash: 'burn_tx_hash',
  burn_confirmed_at: 'burn_confirmed_at',
  completedAt: 'completedAt',
  error_message: 'error_message',
  retry_count: 'retry_count',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RedemptionItemScalarFieldEnum = {
  id: 'id',
  redemptionId: 'redemptionId',
  productId: 'productId',
  quantity: 'quantity',
  tokenCost: 'tokenCost',
  voucherCode: 'voucherCode',
  voucher_expires_at: 'voucher_expires_at',
  createdAt: 'createdAt'
};

exports.Prisma.SupportCircleScalarFieldEnum = {
  id: 'id',
  owner_id: 'owner_id',
  pregnancy_id: 'pregnancy_id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CircleMemberScalarFieldEnum = {
  id: 'id',
  circleId: 'circleId',
  userId: 'userId',
  phone: 'phone',
  name: 'name',
  role: 'role',
  permissions: 'permissions',
  invited_by: 'invited_by',
  invited_at: 'invited_at',
  accepted_at: 'accepted_at',
  is_active: 'is_active',
  created_at: 'created_at'
};

exports.Prisma.DigitalDoulaScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  display_name: 'display_name',
  bio: 'bio',
  avatarUrl: 'avatarUrl',
  specializations: 'specializations',
  languages: 'languages',
  years_experience: 'years_experience',
  certifications: 'certifications',
  rating: 'rating',
  total_ratings: 'total_ratings',
  total_supports: 'total_supports',
  total_tokens_earned: 'total_tokens_earned',
  isAvailable: 'isAvailable',
  max_active_mothers: 'max_active_mothers',
  current_active_mothers: 'current_active_mothers',
  is_verified: 'is_verified',
  verified_at: 'verified_at',
  verified_by: 'verified_by',
  is_active: 'is_active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ArticleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  summary: 'summary',
  content: 'content',
  category: 'category',
  tags: 'tags',
  country: 'country',
  language: 'language',
  gestationalWeekMin: 'gestationalWeekMin',
  gestationalWeekMax: 'gestationalWeekMax',
  thumbnail_url: 'thumbnail_url',
  audioUrl: 'audioUrl',
  read_time_mins: 'read_time_mins',
  author: 'author',
  source: 'source',
  source_url: 'source_url',
  isPublished: 'isPublished',
  publishedAt: 'publishedAt',
  meta_title: 'meta_title',
  meta_description: 'meta_description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuizScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  difficulty: 'difficulty',
  country: 'country',
  language: 'language',
  time_limit_mins: 'time_limit_mins',
  pass_threshold: 'pass_threshold',
  reward_amount: 'reward_amount',
  milestone_def_id: 'milestone_def_id',
  is_active: 'is_active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuizQuestionScalarFieldEnum = {
  id: 'id',
  quizId: 'quizId',
  questionText: 'questionText',
  questionType: 'questionType',
  options: 'options',
  correct_answer: 'correct_answer',
  explanation: 'explanation',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt'
};

exports.Prisma.QuizAttemptScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  quizId: 'quizId',
  score: 'score',
  passed: 'passed',
  answers: 'answers',
  started_at: 'started_at',
  completedAt: 'completedAt',
  duration_seconds: 'duration_seconds',
  rewardGranted: 'rewardGranted',
  created_at: 'created_at'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  body: 'body',
  data: 'data',
  channel: 'channel',
  status: 'status',
  sentAt: 'sentAt',
  delivered_at: 'delivered_at',
  readAt: 'readAt',
  createdAt: 'createdAt'
};

exports.Prisma.SmsMessageScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  phone: 'phone',
  message: 'message',
  template: 'template',
  provider: 'provider',
  provider_message_id: 'provider_message_id',
  status: 'status',
  cost: 'cost',
  currency: 'currency',
  sentAt: 'sentAt',
  deliveredAt: 'deliveredAt',
  failed_at: 'failed_at',
  createdAt: 'createdAt'
};

exports.Prisma.Audit_logsScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  action: 'action',
  entity_type: 'entity_type',
  entity_id: 'entity_id',
  old_values: 'old_values',
  new_values: 'new_values',
  ip_address: 'ip_address',
  user_agent: 'user_agent',
  created_at: 'created_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  id: 'id',
  phone: 'phone',
  walletAddress: 'walletAddress'
};

exports.Prisma.UserProfileOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  avatarUrl: 'avatarUrl'
};

exports.Prisma.ConsentOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  version: 'version',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.SessionOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  deviceId: 'deviceId',
  ipAddress: 'ipAddress',
  refreshTokenHash: 'refreshTokenHash'
};

exports.Prisma.OtpCodeOrderByRelevanceFieldEnum = {
  id: 'id',
  phone: 'phone',
  codeHash: 'codeHash'
};

exports.Prisma.FacilityOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  address: 'address',
  city: 'city',
  phone: 'phone',
  email: 'email',
  website: 'website',
  verificationCode: 'verificationCode'
};

exports.Prisma.PregnancyOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  primaryFacilityId: 'primaryFacilityId'
};

exports.Prisma.MedicalHistoryOrderByRelevanceFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  pregnancyId: 'pregnancyId',
  condition_code: 'condition_code',
  condition_name: 'condition_name',
  verifiedBy: 'verifiedBy'
};

exports.Prisma.AppointmentOrderByRelevanceFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  pregnancyId: 'pregnancyId',
  facilityId: 'facilityId',
  verifiedBy: 'verifiedBy',
  verification_code: 'verification_code',
  notes: 'notes'
};

exports.Prisma.KickSessionOrderByRelevanceFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  pregnancyId: 'pregnancyId',
  notes: 'notes',
  alert_reason: 'alert_reason'
};

exports.Prisma.EmergencyContactOrderByRelevanceFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  name: 'name',
  relationship: 'relationship',
  phone: 'phone'
};

exports.Prisma.MilestoneDefinitionOrderByRelevanceFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  icon: 'icon',
  prerequisite_milestones: 'prerequisite_milestones'
};

exports.Prisma.UserMilestoneOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  pregnancyId: 'pregnancyId',
  milestone_def_id: 'milestone_def_id',
  reward_tx_hash: 'reward_tx_hash'
};

exports.Prisma.VerifierOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  facilityId: 'facilityId',
  verificationCode: 'verificationCode',
  name: 'name',
  credential_number: 'credential_number'
};

exports.Prisma.VerificationOrderByRelevanceFieldEnum = {
  id: 'id',
  userMilestoneId: 'userMilestoneId',
  verifierId: 'verifierId',
  verificationHash: 'verificationHash',
  qrCodeData: 'qrCodeData'
};

exports.Prisma.TokenTransactionOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  tx_hash: 'tx_hash',
  stellar_tx_id: 'stellar_tx_id',
  milestoneId: 'milestoneId',
  redemptionId: 'redemptionId',
  errorMessage: 'errorMessage'
};

exports.Prisma.PartnerOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  logoUrl: 'logoUrl',
  description: 'description',
  api_endpoint: 'api_endpoint',
  webhookUrl: 'webhookUrl'
};

exports.Prisma.PartnerProductOrderByRelevanceFieldEnum = {
  id: 'id',
  partnerId: 'partnerId',
  name: 'name',
  description: 'description',
  external_product_id: 'external_product_id',
  imageUrl: 'imageUrl'
};

exports.Prisma.RedemptionOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  partner_id: 'partner_id',
  external_ref: 'external_ref',
  disbursement_ref: 'disbursement_ref',
  recipient_phone: 'recipient_phone',
  recipient_name: 'recipient_name',
  burn_tx_hash: 'burn_tx_hash',
  error_message: 'error_message'
};

exports.Prisma.RedemptionItemOrderByRelevanceFieldEnum = {
  id: 'id',
  redemptionId: 'redemptionId',
  productId: 'productId',
  voucherCode: 'voucherCode'
};

exports.Prisma.SupportCircleOrderByRelevanceFieldEnum = {
  id: 'id',
  owner_id: 'owner_id',
  pregnancy_id: 'pregnancy_id',
  name: 'name'
};

exports.Prisma.CircleMemberOrderByRelevanceFieldEnum = {
  id: 'id',
  circleId: 'circleId',
  userId: 'userId',
  phone: 'phone',
  name: 'name',
  invited_by: 'invited_by'
};

exports.Prisma.DigitalDoulaOrderByRelevanceFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  display_name: 'display_name',
  bio: 'bio',
  avatarUrl: 'avatarUrl',
  specializations: 'specializations',
  verified_by: 'verified_by'
};

exports.Prisma.ArticleOrderByRelevanceFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  summary: 'summary',
  content: 'content',
  tags: 'tags',
  thumbnail_url: 'thumbnail_url',
  audioUrl: 'audioUrl',
  author: 'author',
  source: 'source',
  source_url: 'source_url',
  meta_title: 'meta_title',
  meta_description: 'meta_description'
};

exports.Prisma.QuizOrderByRelevanceFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  milestone_def_id: 'milestone_def_id'
};

exports.Prisma.QuizQuestionOrderByRelevanceFieldEnum = {
  id: 'id',
  quizId: 'quizId',
  questionText: 'questionText',
  explanation: 'explanation'
};

exports.Prisma.QuizAttemptOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  quizId: 'quizId'
};

exports.Prisma.NotificationOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  body: 'body',
  channel: 'channel',
  status: 'status'
};

exports.Prisma.SmsMessageOrderByRelevanceFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  phone: 'phone',
  message: 'message',
  template: 'template',
  provider: 'provider',
  provider_message_id: 'provider_message_id',
  status: 'status',
  currency: 'currency'
};

exports.Prisma.audit_logsOrderByRelevanceFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  action: 'action',
  entity_type: 'entity_type',
  entity_id: 'entity_id',
  ip_address: 'ip_address',
  user_agent: 'user_agent'
};
exports.country_code = exports.$Enums.country_code = {
  ZA: 'ZA',
  UG: 'UG',
  KE: 'KE'
};

exports.language_code = exports.$Enums.language_code = {
  en: 'en',
  zu: 'zu',
  xh: 'xh',
  st: 'st',
  tn: 'tn',
  lg: 'lg',
  sw: 'sw'
};

exports.user_status = exports.$Enums.user_status = {
  pending: 'pending',
  active: 'active',
  suspended: 'suspended',
  deactivated: 'deactivated'
};

exports.user_role = exports.$Enums.user_role = {
  mother: 'mother',
  support: 'support',
  doula: 'doula',
  chw: 'chw',
  clinician: 'clinician',
  admin: 'admin'
};

exports.consent_type = exports.$Enums.consent_type = {
  terms_of_service: 'terms_of_service',
  privacy_policy: 'privacy_policy',
  health_data_processing: 'health_data_processing',
  marketing_communications: 'marketing_communications',
  data_sharing_research: 'data_sharing_research',
  biometric_data: 'biometric_data'
};

exports.otp_purpose = exports.$Enums.otp_purpose = {
  registration: 'registration',
  login: 'login',
  password_reset: 'password_reset',
  phone_change: 'phone_change',
  verification: 'verification'
};

exports.facility_type = exports.$Enums.facility_type = {
  hospital: 'hospital',
  clinic: 'clinic',
  health_center: 'health_center',
  pharmacy: 'pharmacy',
  laboratory: 'laboratory',
  private_practice: 'private_practice'
};

exports.pregnancy_status = exports.$Enums.pregnancy_status = {
  active: 'active',
  delivered: 'delivered',
  loss: 'loss',
  terminated: 'terminated'
};

exports.blood_type = exports.$Enums.blood_type = {
  A_positive: 'A_positive',
  A_negative: 'A_negative',
  B_positive: 'B_positive',
  B_negative: 'B_negative',
  AB_positive: 'AB_positive',
  AB_negative: 'AB_negative',
  O_positive: 'O_positive',
  O_negative: 'O_negative',
  unknown: 'unknown'
};

exports.condition_type = exports.$Enums.condition_type = {
  chronic: 'chronic',
  pregnancy: 'pregnancy',
  allergy: 'allergy',
  medication: 'medication',
  surgical: 'surgical',
  family_history: 'family_history'
};

exports.condition_status = exports.$Enums.condition_status = {
  active: 'active',
  resolved: 'resolved',
  managed: 'managed'
};

exports.appointment_type = exports.$Enums.appointment_type = {
  anc_visit: 'anc_visit',
  ultrasound: 'ultrasound',
  lab_test: 'lab_test',
  specialist: 'specialist',
  delivery: 'delivery',
  postnatal: 'postnatal',
  emergency: 'emergency'
};

exports.appointment_status = exports.$Enums.appointment_status = {
  scheduled: 'scheduled',
  confirmed: 'confirmed',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show',
  rescheduled: 'rescheduled'
};

exports.milestone_category = exports.$Enums.milestone_category = {
  clinical: 'clinical',
  wellness: 'wellness',
  education: 'education',
  community: 'community'
};

exports.verification_type = exports.$Enums.verification_type = {
  qr_scan: 'qr_scan',
  provider_signature: 'provider_signature',
  system_automatic: 'system_automatic',
  photo_proof: 'photo_proof',
  self_reported: 'self_reported'
};

exports.milestone_status = exports.$Enums.milestone_status = {
  locked: 'locked',
  available: 'available',
  in_progress: 'in_progress',
  pending_verification: 'pending_verification',
  completed: 'completed',
  expired: 'expired'
};

exports.verifier_type = exports.$Enums.verifier_type = {
  clinic: 'clinic',
  chw: 'chw',
  digital_doula: 'digital_doula',
  system: 'system'
};

exports.token_tx_type = exports.$Enums.token_tx_type = {
  mint_milestone: 'mint_milestone',
  mint_referral: 'mint_referral',
  mint_grant: 'mint_grant',
  burn_redemption: 'burn_redemption',
  burn_expired: 'burn_expired',
  transfer_in: 'transfer_in',
  transfer_out: 'transfer_out'
};

exports.token_tx_status = exports.$Enums.token_tx_status = {
  pending: 'pending',
  processing: 'processing',
  confirmed: 'confirmed',
  failed: 'failed'
};

exports.partner_type = exports.$Enums.partner_type = {
  mobile_money: 'mobile_money',
  transport: 'transport',
  retail: 'retail',
  healthcare: 'healthcare',
  nutrition: 'nutrition'
};

exports.product_category = exports.$Enums.product_category = {
  transport_voucher: 'transport_voucher',
  mobile_money: 'mobile_money',
  data_bundle: 'data_bundle',
  nutrition_pack: 'nutrition_pack',
  pharmacy_voucher: 'pharmacy_voucher',
  clinic_credit: 'clinic_credit',
  baby_supplies: 'baby_supplies'
};

exports.redemption_status = exports.$Enums.redemption_status = {
  pending: 'pending',
  processing: 'processing',
  awaiting_burn: 'awaiting_burn',
  completed: 'completed',
  failed: 'failed',
  cancelled: 'cancelled',
  expired: 'expired'
};

exports.circle_role = exports.$Enums.circle_role = {
  owner: 'owner',
  partner: 'partner',
  family: 'family',
  friend: 'friend',
  doula: 'doula'
};

exports.circle_permission = exports.$Enums.circle_permission = {
  view_health: 'view_health',
  view_location: 'view_location',
  receive_alerts: 'receive_alerts',
  contribute_tokens: 'contribute_tokens'
};

exports.content_category = exports.$Enums.content_category = {
  pregnancy_basics: 'pregnancy_basics',
  nutrition: 'nutrition',
  exercise: 'exercise',
  mental_health: 'mental_health',
  labor_delivery: 'labor_delivery',
  breastfeeding: 'breastfeeding',
  newborn_care: 'newborn_care',
  postpartum: 'postpartum',
  danger_signs: 'danger_signs',
  family_planning: 'family_planning'
};

exports.quiz_difficulty = exports.$Enums.quiz_difficulty = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced'
};

exports.question_type = exports.$Enums.question_type = {
  multiple_choice: 'multiple_choice',
  true_false: 'true_false',
  multi_select: 'multi_select'
};

exports.Prisma.ModelName = {
  User: 'User',
  UserProfile: 'UserProfile',
  Consent: 'Consent',
  Session: 'Session',
  OtpCode: 'OtpCode',
  Facility: 'Facility',
  Pregnancy: 'Pregnancy',
  MedicalHistory: 'MedicalHistory',
  Appointment: 'Appointment',
  KickSession: 'KickSession',
  EmergencyContact: 'EmergencyContact',
  MilestoneDefinition: 'MilestoneDefinition',
  UserMilestone: 'UserMilestone',
  Verifier: 'Verifier',
  Verification: 'Verification',
  TokenTransaction: 'TokenTransaction',
  Partner: 'Partner',
  PartnerProduct: 'PartnerProduct',
  Redemption: 'Redemption',
  RedemptionItem: 'RedemptionItem',
  SupportCircle: 'SupportCircle',
  CircleMember: 'CircleMember',
  DigitalDoula: 'DigitalDoula',
  Article: 'Article',
  Quiz: 'Quiz',
  QuizQuestion: 'QuizQuestion',
  QuizAttempt: 'QuizAttempt',
  Notification: 'Notification',
  SmsMessage: 'SmsMessage',
  audit_logs: 'audit_logs'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "D:\\SM-WEB\\femtech-api\\generated\\prisma-client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "fullTextSearch",
      "postgresqlExtensions"
    ],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "../../prisma",
  "clientVersion": "5.10.0",
  "engineVersion": "5a9203d0590c951969e85a7d07215503f4672eb9",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../generated/prisma-client\"\n  previewFeatures = [\"fullTextSearch\", \"postgresqlExtensions\"]\n}\n\ndatasource db {\n  provider   = \"postgresql\"\n  url        = env(\"DATABASE_URL\")\n  extensions = [pgcrypto, uuid_ossp(map: \"uuid-ossp\", schema: \"public\")]\n}\n\nmodel User {\n  id                                               String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  phone                                            String             @unique(map: \"users_phone_unique\") @db.VarChar(20)\n  phoneVerified                                    Boolean            @default(false) @map(\"phone_verified\")\n  phone_verified_at                                DateTime?          @db.Timestamptz(6)\n  country                                          country_code\n  language                                         language_code      @default(en)\n  status                                           user_status        @default(pending)\n  role                                             user_role          @default(mother)\n  walletAddress                                    String?            @unique(map: \"users_wallet_unique\") @map(\"wallet_address\") @db.VarChar(56)\n  walletCreatedAt                                  DateTime?          @map(\"wallet_created_at\") @db.Timestamptz(6)\n  lastLoginAt                                      DateTime?          @map(\"last_login_at\") @db.Timestamptz(6)\n  login_count                                      Int                @default(0)\n  createdAt                                        DateTime           @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt                                        DateTime           @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  appointments_appointments_user_idTousers         Appointment[]      @relation(\"appointments_user_idTousers\")\n  appointments                                     Appointment[]\n  audit_logs                                       audit_logs[]\n  circle_members_circle_members_invited_byTousers  CircleMember[]     @relation(\"circle_members_invited_byTousers\")\n  circleMembers                                    CircleMember[]\n  consents                                         Consent[]\n  digital_doulas_digital_doulas_user_idTousers     DigitalDoula?      @relation(\"digital_doulas_user_idTousers\")\n  digital_doulas_digital_doulas_verified_byTousers DigitalDoula[]     @relation(\"digital_doulas_verified_byTousers\")\n  emergency_contacts                               EmergencyContact[]\n  kick_sessions                                    KickSession[]\n  medical_history_medical_history_user_idTousers   MedicalHistory[]   @relation(\"medical_history_user_idTousers\")\n  medicalHistory                                   MedicalHistory[]\n  notifications                                    Notification[]\n  pregnancies                                      Pregnancy[]\n  quizAttempts                                     QuizAttempt[]\n  redemptions                                      Redemption[]\n  sessions                                         Session[]\n  sms_messages                                     SmsMessage[]\n  support_circles                                  SupportCircle[]\n  tokenTransactions                                TokenTransaction[]\n  milestones                                       UserMilestone[]\n  profile                                          UserProfile?\n  verifier                                         Verifier[]\n\n  @@index([country], map: \"idx_users_country\")\n  @@index([createdAt], map: \"idx_users_created_at\")\n  @@index([phone], map: \"idx_users_phone\")\n  @@index([status], map: \"idx_users_status\")\n  @@map(\"users\")\n}\n\nmodel UserProfile {\n  id                   String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId               String   @unique(map: \"user_profiles_user_unique\") @map(\"user_id\") @db.Uuid\n  firstNameEncrypted   Bytes?   @map(\"first_name_encrypted\")\n  lastNameEncrypted    Bytes?   @map(\"last_name_encrypted\")\n  dateOfBirthEncrypted Bytes?   @map(\"date_of_birth_encrypted\")\n  avatarUrl            String?  @map(\"avatar_url\") @db.VarChar(500)\n  createdAt            DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt            DateTime @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([userId], map: \"idx_user_profiles_user_id\")\n  @@map(\"user_profiles\")\n}\n\nmodel Consent {\n  id          String       @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId      String       @map(\"user_id\") @db.Uuid\n  consentType consent_type @map(\"consent_type\")\n  version     String       @db.VarChar(20)\n  granted     Boolean\n  grantedAt   DateTime?    @map(\"granted_at\") @db.Timestamptz(6)\n  revokedAt   DateTime?    @map(\"revoked_at\") @db.Timestamptz(6)\n  ipAddress   String?      @map(\"ip_address\") @db.Inet\n  userAgent   String?      @map(\"user_agent\")\n  createdAt   DateTime     @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@unique([userId, consentType, version], map: \"consents_user_type_unique\")\n  @@index([consentType], map: \"idx_consents_type\")\n  @@index([userId], map: \"idx_consents_user_id\")\n  @@map(\"consents\")\n}\n\nmodel Session {\n  id               String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId           String   @map(\"user_id\") @db.Uuid\n  deviceId         String?  @map(\"device_id\") @db.VarChar(100)\n  device_info      Json?\n  ipAddress        String?  @map(\"ip_address\") @db.Inet\n  refreshTokenHash String   @unique(map: \"sessions_token_unique\") @map(\"refresh_token_hash\") @db.VarChar(64)\n  expiresAt        DateTime @map(\"expires_at\") @db.Timestamptz(6)\n  last_used_at     DateTime @default(now()) @db.Timestamptz(6)\n  createdAt        DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([expiresAt], map: \"idx_sessions_expires_at\")\n  @@index([refreshTokenHash], map: \"idx_sessions_token_hash\")\n  @@index([userId], map: \"idx_sessions_user_id\")\n  @@map(\"sessions\")\n}\n\nmodel OtpCode {\n  id          String      @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  phone       String      @db.VarChar(20)\n  codeHash    String      @map(\"code_hash\") @db.VarChar(64)\n  purpose     otp_purpose\n  attempts    Int         @default(0)\n  maxAttempts Int         @default(3) @map(\"max_attempts\")\n  expiresAt   DateTime    @map(\"expires_at\") @db.Timestamptz(6)\n  verified_at DateTime?   @db.Timestamptz(6)\n  createdAt   DateTime    @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n\n  @@index([expiresAt], map: \"idx_otp_codes_expires_at\")\n  @@index([phone], map: \"idx_otp_codes_phone\")\n  @@index([phone, purpose], map: \"idx_otp_codes_phone_purpose\")\n  @@map(\"otp_codes\")\n}\n\nmodel Facility {\n  id               String        @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  name             String        @db.VarChar(200)\n  type             facility_type\n  address          String?\n  city             String?       @db.VarChar(100)\n  country          country_code\n  latitude         Decimal?      @db.Decimal(10, 8)\n  longitude        Decimal?      @db.Decimal(11, 8)\n  phone            String?       @db.VarChar(20)\n  email            String?       @db.VarChar(255)\n  website          String?       @db.VarChar(500)\n  operatingHours   Json?         @map(\"operating_hours\")\n  isPartner        Boolean       @default(false) @map(\"is_partner\")\n  partner_since    DateTime?     @db.Date\n  accepts_tokens   Boolean       @default(false)\n  verificationCode String?       @map(\"verification_code\") @db.VarChar(20)\n  isActive         Boolean       @default(true) @map(\"is_active\")\n  createdAt        DateTime      @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt        DateTime      @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  appointments     Appointment[]\n  pregnancies      Pregnancy[]\n  verifiers        Verifier[]\n\n  @@index([country], map: \"idx_facilities_country\")\n  @@index([type], map: \"idx_facilities_type\")\n  @@map(\"facilities\")\n}\n\nmodel Pregnancy {\n  id                   String           @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId               String           @map(\"user_id\") @db.Uuid\n  status               pregnancy_status @default(active)\n  last_period_date     DateTime?        @db.Date\n  estimated_due_date   DateTime         @db.Date\n  conceptionDate       DateTime?        @map(\"conception_date\") @db.Date\n  actual_delivery_date DateTime?        @db.Date\n  gravida              Int              @default(1)\n  parity               Int              @default(0)\n  isHighRisk           Boolean          @default(false) @map(\"is_high_risk\")\n  riskFactors          Json?            @map(\"risk_factors\")\n  risk_score           Int?\n  bloodType            blood_type?      @default(unknown) @map(\"blood_type\")\n  primaryFacilityId    String?          @map(\"primary_facility_id\") @db.Uuid\n  createdAt            DateTime         @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt            DateTime         @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  appointments         Appointment[]\n  kickSessions         KickSession[]\n  medicalHistory       MedicalHistory[]\n  primaryFacility      Facility?        @relation(fields: [primaryFacilityId], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  user                 User             @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  support_circles      SupportCircle[]\n  milestones           UserMilestone[]\n\n  @@index([estimated_due_date], map: \"idx_pregnancies_due_date\")\n  @@index([status], map: \"idx_pregnancies_status\")\n  @@index([userId], map: \"idx_pregnancies_user_id\")\n  @@map(\"pregnancies\")\n}\n\nmodel MedicalHistory {\n  id                                   String           @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  user_id                              String           @db.Uuid\n  pregnancyId                          String?          @map(\"pregnancy_id\") @db.Uuid\n  conditionType                        condition_type   @map(\"condition_type\")\n  condition_code                       String?          @db.VarChar(20)\n  condition_name                       String           @db.VarChar(200)\n  status                               condition_status @default(active)\n  diagnosedDate                        DateTime?        @map(\"diagnosed_date\") @db.Date\n  resolved_date                        DateTime?        @db.Date\n  notesEncrypted                       Bytes?           @map(\"notes_encrypted\")\n  verifiedBy                           String?          @map(\"verified_by\") @db.Uuid\n  verifiedAt                           DateTime?        @map(\"verified_at\") @db.Timestamptz(6)\n  createdAt                            DateTime         @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt                            DateTime         @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  pregnancy                            Pregnancy?       @relation(fields: [pregnancyId], references: [id], onUpdate: NoAction)\n  users_medical_history_user_idTousers User             @relation(\"medical_history_user_idTousers\", fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  verifier                             User?            @relation(fields: [verifiedBy], references: [id], onDelete: NoAction, onUpdate: NoAction)\n\n  @@index([pregnancyId], map: \"idx_medical_history_pregnancy_id\")\n  @@index([conditionType], map: \"idx_medical_history_type\")\n  @@index([user_id], map: \"idx_medical_history_user_id\")\n  @@map(\"medical_history\")\n}\n\nmodel Appointment {\n  id                                String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  user_id                           String             @db.Uuid\n  pregnancyId                       String?            @map(\"pregnancy_id\") @db.Uuid\n  facilityId                        String?            @map(\"facility_id\") @db.Uuid\n  appointment_type                  appointment_type\n  status                            appointment_status @default(scheduled)\n  scheduled_at                      DateTime           @db.Timestamptz(6)\n  duration_minutes                  Int?               @default(30)\n  reminder_sent_at                  DateTime?          @db.Timestamptz(6)\n  completed_at                      DateTime?          @db.Timestamptz(6)\n  verified_at                       DateTime?          @db.Timestamptz(6)\n  verifiedBy                        String?            @map(\"verified_by\") @db.Uuid\n  verification_code                 String?            @db.VarChar(20)\n  notes                             String?\n  createdAt                         DateTime           @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt                         DateTime           @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  facility                          Facility?          @relation(fields: [facilityId], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  pregnancy                         Pregnancy?         @relation(fields: [pregnancyId], references: [id], onUpdate: NoAction)\n  users_appointments_user_idTousers User               @relation(\"appointments_user_idTousers\", fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  verifier                          User?              @relation(fields: [verifiedBy], references: [id], onDelete: NoAction, onUpdate: NoAction)\n\n  @@index([facilityId], map: \"idx_appointments_facility_id\")\n  @@index([pregnancyId], map: \"idx_appointments_pregnancy_id\")\n  @@index([scheduled_at], map: \"idx_appointments_scheduled_at\")\n  @@index([status], map: \"idx_appointments_status\")\n  @@index([user_id], map: \"idx_appointments_user_id\")\n  @@map(\"appointments\")\n}\n\nmodel KickSession {\n  id              String    @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  user_id         String    @db.Uuid\n  pregnancyId     String    @map(\"pregnancy_id\") @db.Uuid\n  start_time      DateTime  @db.Timestamptz(6)\n  end_time        DateTime? @db.Timestamptz(6)\n  kickCount       Int       @default(0) @map(\"kick_count\")\n  target_count    Int       @default(10)\n  durationMinutes Int?      @map(\"duration_minutes\")\n  notes           String?\n  alertTriggered  Boolean   @default(false) @map(\"alert_triggered\")\n  alert_reason    String?\n  createdAt       DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  pregnancy       Pregnancy @relation(fields: [pregnancyId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  users           User      @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([pregnancyId], map: \"idx_kick_sessions_pregnancy_id\")\n  @@index([start_time], map: \"idx_kick_sessions_start_time\")\n  @@index([user_id], map: \"idx_kick_sessions_user_id\")\n  @@map(\"kick_sessions\")\n}\n\nmodel EmergencyContact {\n  id           String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  user_id      String   @db.Uuid\n  name         String   @db.VarChar(100)\n  relationship String   @db.VarChar(50)\n  phone        String   @db.VarChar(20)\n  priority     Int      @default(1)\n  is_active    Boolean  @default(true)\n  createdAt    DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt    DateTime @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  users        User     @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([user_id], map: \"idx_emergency_contacts_user_id\")\n  @@map(\"emergency_contacts\")\n}\n\nmodel MilestoneDefinition {\n  id                      String              @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  code                    String              @db.VarChar(50)\n  name                    String              @db.VarChar(200)\n  description             String?\n  icon                    String?             @db.VarChar(50)\n  category                milestone_category\n  country                 country_code?\n  rewardAmount            Int                 @map(\"reward_amount\")\n  maxClaimsPerPregnancy   Int                 @default(1) @map(\"max_claims_per_pregnancy\")\n  requiresVerification    Boolean             @default(true) @map(\"requires_verification\")\n  verificationTypes       verification_type[] @default([qr_scan]) @map(\"verification_types\")\n  gestationalWeekMin      Int?                @map(\"gestational_week_min\")\n  gestationalWeekMax      Int?                @map(\"gestational_week_max\")\n  days_to_complete        Int?\n  prerequisite_milestones String[]            @db.Uuid\n  isActive                Boolean             @default(true) @map(\"is_active\")\n  sortOrder               Int                 @default(0) @map(\"sort_order\")\n  createdAt               DateTime            @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt               DateTime            @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  quizzes                 Quiz[]\n  user_milestones         UserMilestone[]\n\n  @@unique([code, country], map: \"milestone_definitions_code_country_unique\")\n  @@index([category], map: \"idx_milestone_definitions_category\")\n  @@index([code], map: \"idx_milestone_definitions_code\")\n  @@index([country], map: \"idx_milestone_definitions_country\")\n  @@map(\"milestone_definitions\")\n}\n\nmodel UserMilestone {\n  id                    String              @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId                String              @map(\"user_id\") @db.Uuid\n  pregnancyId           String?             @map(\"pregnancy_id\") @db.Uuid\n  milestone_def_id      String              @db.Uuid\n  status                milestone_status    @default(available)\n  progress              Int                 @default(0)\n  progressData          Json?               @map(\"progress_data\")\n  startedAt             DateTime?           @map(\"started_at\") @db.Timestamptz(6)\n  completedAt           DateTime?           @map(\"completed_at\") @db.Timestamptz(6)\n  expiresAt             DateTime?           @map(\"expires_at\") @db.Timestamptz(6)\n  rewardAmount          Int?                @map(\"reward_amount\")\n  reward_minted         Boolean             @default(false)\n  reward_tx_hash        String?             @db.VarChar(64)\n  reward_minted_at      DateTime?           @db.Timestamptz(6)\n  createdAt             DateTime            @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt             DateTime            @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  token_transactions    TokenTransaction[]\n  milestone_definitions MilestoneDefinition @relation(fields: [milestone_def_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  pregnancy             Pregnancy?          @relation(fields: [pregnancyId], references: [id], onUpdate: NoAction)\n  user                  User                @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  verifications         Verification[]\n\n  @@unique([userId, pregnancyId, milestone_def_id], map: \"user_milestones_unique\")\n  @@index([milestone_def_id], map: \"idx_user_milestones_def_id\")\n  @@index([pregnancyId], map: \"idx_user_milestones_pregnancy_id\")\n  @@index([status], map: \"idx_user_milestones_status\")\n  @@index([userId], map: \"idx_user_milestones_user_id\")\n  @@map(\"user_milestones\")\n}\n\nmodel Verifier {\n  id                  String         @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId              String?        @map(\"user_id\") @db.Uuid\n  facilityId          String?        @map(\"facility_id\") @db.Uuid\n  verifier_type       verifier_type\n  verificationCode    String         @unique(map: \"verifiers_code_unique\") @map(\"verification_code\") @db.VarChar(20)\n  name                String         @db.VarChar(200)\n  credential_number   String?        @db.VarChar(100)\n  credential_verified Boolean        @default(false)\n  total_verifications Int            @default(0)\n  isActive            Boolean        @default(true) @map(\"is_active\")\n  createdAt           DateTime       @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt           DateTime       @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  verifications       Verification[]\n  facility            Facility?      @relation(fields: [facilityId], references: [id], onUpdate: NoAction)\n  user                User?          @relation(fields: [userId], references: [id], onUpdate: NoAction)\n\n  @@index([verificationCode], map: \"idx_verifiers_code\")\n  @@index([facilityId], map: \"idx_verifiers_facility_id\")\n  @@index([verifier_type], map: \"idx_verifiers_type\")\n  @@index([userId], map: \"idx_verifiers_user_id\")\n  @@map(\"verifiers\")\n}\n\nmodel Verification {\n  id               String            @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userMilestoneId  String            @map(\"user_milestone_id\") @db.Uuid\n  verifierId       String?           @map(\"verifier_id\") @db.Uuid\n  verificationType verification_type @map(\"verification_type\")\n  verificationHash String            @map(\"verification_hash\") @db.VarChar(64)\n  qrCodeData       String?           @map(\"qr_code_data\")\n  signature        Bytes?\n  metadata         Json?\n  latitude         Decimal?          @db.Decimal(10, 8)\n  longitude        Decimal?          @db.Decimal(11, 8)\n  verified_at      DateTime          @default(now()) @db.Timestamptz(6)\n  createdAt        DateTime          @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  userMilestone    UserMilestone     @relation(fields: [userMilestoneId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  verifier         Verifier?         @relation(fields: [verifierId], references: [id], onUpdate: NoAction)\n\n  @@index([verificationHash], map: \"idx_verifications_hash\")\n  @@index([userMilestoneId], map: \"idx_verifications_milestone_id\")\n  @@index([verified_at], map: \"idx_verifications_verified_at\")\n  @@index([verifierId], map: \"idx_verifications_verifier_id\")\n  @@map(\"verifications\")\n}\n\nmodel TokenTransaction {\n  id              String          @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId          String          @map(\"user_id\") @db.Uuid\n  type            token_tx_type\n  status          token_tx_status @default(pending)\n  amount          Int\n  tx_hash         String?         @db.VarChar(64)\n  stellar_tx_id   String?         @db.VarChar(64)\n  milestoneId     String?         @map(\"milestone_id\") @db.Uuid\n  redemptionId    String?         @map(\"redemption_id\") @db.Uuid\n  errorMessage    String?         @map(\"error_message\")\n  retryCount      Int             @default(0) @map(\"retry_count\")\n  processed_at    DateTime?       @db.Timestamptz(6)\n  createdAt       DateTime        @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  user_milestones UserMilestone?  @relation(fields: [milestoneId], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  redemption      Redemption?     @relation(fields: [redemptionId], references: [id], onDelete: NoAction, onUpdate: NoAction, map: \"token_transactions_redemption_fk\")\n  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([createdAt], map: \"idx_token_tx_created_at\")\n  @@index([milestoneId], map: \"idx_token_tx_milestone_id\")\n  @@index([status], map: \"idx_token_tx_status\")\n  @@index([type], map: \"idx_token_tx_type\")\n  @@index([userId], map: \"idx_token_tx_user_id\")\n  @@map(\"token_transactions\")\n}\n\nmodel Partner {\n  id              String           @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  name            String           @db.VarChar(200)\n  type            partner_type\n  country         country_code\n  logoUrl         String?          @map(\"logo_url\") @db.VarChar(500)\n  description     String?\n  api_endpoint    String?          @db.VarChar(500)\n  apiKeyEncrypted Bytes?           @map(\"api_key_encrypted\")\n  webhookUrl      String?          @map(\"webhook_url\") @db.VarChar(500)\n  config          Json?\n  isActive        Boolean          @default(true) @map(\"is_active\")\n  createdAt       DateTime         @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt       DateTime         @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  products        PartnerProduct[]\n  redemptions     Redemption[]\n\n  @@index([country], map: \"idx_partners_country\")\n  @@index([type], map: \"idx_partners_type\")\n  @@map(\"partners\")\n}\n\nmodel PartnerProduct {\n  id                   String           @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  partnerId            String           @map(\"partner_id\") @db.Uuid\n  name                 String           @db.VarChar(200)\n  description          String?\n  category             product_category\n  tokenCost            Int              @map(\"token_cost\")\n  external_product_id  String?          @db.VarChar(100)\n  imageUrl             String?          @map(\"image_url\") @db.VarChar(500)\n  is_available         Boolean          @default(true)\n  stockQuantity        Int?             @map(\"stock_quantity\")\n  max_per_user_daily   Int?\n  max_per_user_monthly Int?\n  createdAt            DateTime         @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt            DateTime         @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  partner              Partner          @relation(fields: [partnerId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  redemptions          RedemptionItem[]\n\n  @@index([category], map: \"idx_partner_products_category\")\n  @@index([partnerId], map: \"idx_partner_products_partner_id\")\n  @@map(\"partner_products\")\n}\n\nmodel Redemption {\n  id                String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId            String             @map(\"user_id\") @db.Uuid\n  partner_id        String             @db.Uuid\n  type              partner_type\n  totalTokens       Int                @map(\"total_tokens\")\n  status            redemption_status  @default(pending)\n  external_ref      String?            @db.VarChar(100)\n  disbursement_ref  String?            @db.VarChar(100)\n  recipient_phone   String?            @db.VarChar(20)\n  recipient_name    String?            @db.VarChar(100)\n  burn_tx_hash      String?            @db.VarChar(64)\n  burn_confirmed_at DateTime?          @db.Timestamptz(6)\n  completedAt       DateTime?          @map(\"completed_at\") @db.Timestamptz(6)\n  error_message     String?\n  retry_count       Int                @default(0)\n  expiresAt         DateTime?          @map(\"expires_at\") @db.Timestamptz(6)\n  createdAt         DateTime           @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt         DateTime           @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  items             RedemptionItem[]\n  partners          Partner            @relation(fields: [partner_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  transactions      TokenTransaction[]\n\n  @@index([createdAt], map: \"idx_redemptions_created_at\")\n  @@index([partner_id], map: \"idx_redemptions_partner_id\")\n  @@index([status], map: \"idx_redemptions_status\")\n  @@index([userId], map: \"idx_redemptions_user_id\")\n  @@map(\"redemptions\")\n}\n\nmodel RedemptionItem {\n  id                 String         @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  redemptionId       String         @map(\"redemption_id\") @db.Uuid\n  productId          String         @map(\"product_id\") @db.Uuid\n  quantity           Int            @default(1)\n  tokenCost          Int            @map(\"token_cost\")\n  voucherCode        String?        @map(\"voucher_code\") @db.VarChar(100)\n  voucher_expires_at DateTime?      @db.Timestamptz(6)\n  createdAt          DateTime       @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  product            PartnerProduct @relation(fields: [productId], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  redemption         Redemption     @relation(fields: [redemptionId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([productId], map: \"idx_redemption_items_product_id\")\n  @@index([redemptionId], map: \"idx_redemption_items_redemption_id\")\n  @@map(\"redemption_items\")\n}\n\nmodel SupportCircle {\n  id           String         @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  owner_id     String         @db.Uuid\n  pregnancy_id String?        @db.Uuid\n  name         String         @default(\"My Support Circle\") @db.VarChar(100)\n  createdAt    DateTime       @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt    DateTime       @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  members      CircleMember[]\n  users        User           @relation(fields: [owner_id], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  pregnancies  Pregnancy?     @relation(fields: [pregnancy_id], references: [id], onUpdate: NoAction)\n\n  @@index([owner_id], map: \"idx_support_circles_owner_id\")\n  @@index([pregnancy_id], map: \"idx_support_circles_pregnancy_id\")\n  @@map(\"support_circles\")\n}\n\nmodel CircleMember {\n  id                                     String              @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  circleId                               String              @map(\"circle_id\") @db.Uuid\n  userId                                 String?             @map(\"user_id\") @db.Uuid\n  phone                                  String?             @db.VarChar(20)\n  name                                   String?             @db.VarChar(100)\n  role                                   circle_role\n  permissions                            circle_permission[] @default([view_health, receive_alerts])\n  invited_by                             String?             @db.Uuid\n  invited_at                             DateTime            @default(now()) @db.Timestamptz(6)\n  accepted_at                            DateTime?           @db.Timestamptz(6)\n  is_active                              Boolean             @default(true)\n  created_at                             DateTime            @default(now()) @db.Timestamptz(6)\n  circle                                 SupportCircle       @relation(fields: [circleId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  users_circle_members_invited_byTousers User?               @relation(\"circle_members_invited_byTousers\", fields: [invited_by], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  user                                   User?               @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@unique([circleId, phone], map: \"circle_members_phone_unique\")\n  @@unique([circleId, userId], map: \"circle_members_unique\")\n  @@index([circleId], map: \"idx_circle_members_circle_id\")\n  @@index([userId], map: \"idx_circle_members_user_id\")\n  @@map(\"circle_members\")\n}\n\nmodel DigitalDoula {\n  id                                      String          @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  user_id                                 String          @unique(map: \"digital_doulas_user_unique\") @db.Uuid\n  display_name                            String          @db.VarChar(100)\n  bio                                     String?\n  avatarUrl                               String?         @map(\"avatar_url\") @db.VarChar(500)\n  specializations                         String[]        @db.VarChar(100)\n  languages                               language_code[] @default([en])\n  years_experience                        Int?\n  certifications                          Json?\n  rating                                  Decimal?        @db.Decimal(3, 2)\n  total_ratings                           Int             @default(0)\n  total_supports                          Int             @default(0)\n  total_tokens_earned                     Int             @default(0)\n  isAvailable                             Boolean         @default(true) @map(\"is_available\")\n  max_active_mothers                      Int             @default(10)\n  current_active_mothers                  Int             @default(0)\n  is_verified                             Boolean         @default(false)\n  verified_at                             DateTime?       @db.Timestamptz(6)\n  verified_by                             String?         @db.Uuid\n  is_active                               Boolean         @default(true)\n  createdAt                               DateTime        @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt                               DateTime        @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  users_digital_doulas_user_idTousers     User            @relation(\"digital_doulas_user_idTousers\", fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  users_digital_doulas_verified_byTousers User?           @relation(\"digital_doulas_verified_byTousers\", fields: [verified_by], references: [id], onDelete: NoAction, onUpdate: NoAction)\n\n  @@index([languages], map: \"idx_digital_doulas_languages\", type: Gin)\n  @@index([rating(sort: Desc)], map: \"idx_digital_doulas_rating\")\n  @@index([user_id], map: \"idx_digital_doulas_user_id\")\n  @@map(\"digital_doulas\")\n}\n\nmodel Article {\n  id                 String           @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  title              String           @db.VarChar(200)\n  slug               String           @db.VarChar(200)\n  summary            String?\n  content            String\n  category           content_category\n  tags               String[]         @db.VarChar(50)\n  country            country_code?\n  language           language_code    @default(en)\n  gestationalWeekMin Int?             @map(\"gestational_week_min\")\n  gestationalWeekMax Int?             @map(\"gestational_week_max\")\n  thumbnail_url      String?          @db.VarChar(500)\n  audioUrl           String?          @map(\"audio_url\") @db.VarChar(500)\n  read_time_mins     Int?\n  author             String?          @db.VarChar(100)\n  source             String?          @db.VarChar(200)\n  source_url         String?          @db.VarChar(500)\n  isPublished        Boolean          @default(false) @map(\"is_published\")\n  publishedAt        DateTime?        @map(\"published_at\") @db.Timestamptz(6)\n  meta_title         String?          @db.VarChar(200)\n  meta_description   String?          @db.VarChar(500)\n  createdAt          DateTime         @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt          DateTime         @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n\n  @@unique([slug, language], map: \"articles_slug_lang_unique\")\n  @@index([category], map: \"idx_articles_category\")\n  @@index([country], map: \"idx_articles_country\")\n  @@index([gestationalWeekMin, gestationalWeekMax], map: \"idx_articles_gestational\")\n  @@index([language], map: \"idx_articles_language\")\n  @@index([slug], map: \"idx_articles_slug\")\n  @@index([tags], map: \"idx_articles_tags\", type: Gin)\n  @@map(\"articles\")\n}\n\nmodel Quiz {\n  id                    String               @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  title                 String               @db.VarChar(200)\n  description           String?\n  category              content_category\n  difficulty            quiz_difficulty      @default(beginner)\n  country               country_code?\n  language              language_code        @default(en)\n  time_limit_mins       Int?\n  pass_threshold        Int                  @default(70)\n  reward_amount         Int                  @default(0)\n  milestone_def_id      String?              @db.Uuid\n  is_active             Boolean              @default(true)\n  createdAt             DateTime             @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  updatedAt             DateTime             @default(now()) @updatedAt @map(\"updated_at\") @db.Timestamptz(6)\n  attempts              QuizAttempt[]\n  questions             QuizQuestion[]\n  milestone_definitions MilestoneDefinition? @relation(fields: [milestone_def_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n\n  @@index([category], map: \"idx_quizzes_category\")\n  @@index([country], map: \"idx_quizzes_country\")\n  @@map(\"quizzes\")\n}\n\nmodel QuizQuestion {\n  id             String        @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  quizId         String        @map(\"quiz_id\") @db.Uuid\n  questionText   String        @map(\"question_text\")\n  questionType   question_type @map(\"question_type\")\n  options        Json\n  correct_answer Json\n  explanation    String?\n  sortOrder      Int           @default(0) @map(\"sort_order\")\n  createdAt      DateTime      @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  quiz           Quiz          @relation(fields: [quizId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([quizId, sortOrder], map: \"idx_quiz_questions_order\")\n  @@index([quizId], map: \"idx_quiz_questions_quiz_id\")\n  @@map(\"quiz_questions\")\n}\n\nmodel QuizAttempt {\n  id               String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId           String   @map(\"user_id\") @db.Uuid\n  quizId           String   @map(\"quiz_id\") @db.Uuid\n  score            Int\n  passed           Boolean\n  answers          Json\n  started_at       DateTime @db.Timestamptz(6)\n  completedAt      DateTime @map(\"completed_at\") @db.Timestamptz(6)\n  duration_seconds Int?\n  rewardGranted    Boolean  @default(false) @map(\"reward_granted\")\n  created_at       DateTime @default(now()) @db.Timestamptz(6)\n  quiz             Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([quizId], map: \"idx_quiz_attempts_quiz_id\")\n  @@index([userId], map: \"idx_quiz_attempts_user_id\")\n  @@map(\"quiz_attempts\")\n}\n\nmodel Notification {\n  id           String    @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId       String    @map(\"user_id\") @db.Uuid\n  type         String    @db.VarChar(50)\n  title        String    @db.VarChar(200)\n  body         String\n  data         Json?\n  channel      String    @db.VarChar(20)\n  status       String    @default(\"pending\") @db.VarChar(20)\n  sentAt       DateTime? @map(\"sent_at\") @db.Timestamptz(6)\n  delivered_at DateTime? @db.Timestamptz(6)\n  readAt       DateTime? @map(\"read_at\") @db.Timestamptz(6)\n  createdAt    DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([createdAt], map: \"idx_notifications_created_at\")\n  @@index([status], map: \"idx_notifications_status\")\n  @@index([type], map: \"idx_notifications_type\")\n  @@index([userId], map: \"idx_notifications_user_id\")\n  @@map(\"notifications\")\n}\n\nmodel SmsMessage {\n  id                  String    @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  user_id             String?   @db.Uuid\n  phone               String    @db.VarChar(20)\n  message             String\n  template            String?   @db.VarChar(50)\n  provider            String    @db.VarChar(50)\n  provider_message_id String?   @db.VarChar(100)\n  status              String    @default(\"pending\") @db.VarChar(20)\n  cost                Decimal?  @db.Decimal(10, 4)\n  currency            String?   @db.VarChar(3)\n  sentAt              DateTime? @map(\"sent_at\") @db.Timestamptz(6)\n  deliveredAt         DateTime? @map(\"delivered_at\") @db.Timestamptz(6)\n  failed_at           DateTime? @db.Timestamptz(6)\n  createdAt           DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz(6)\n  users               User?     @relation(fields: [user_id], references: [id], onUpdate: NoAction)\n\n  @@index([phone], map: \"idx_sms_messages_phone\")\n  @@index([provider_message_id], map: \"idx_sms_messages_provider_id\")\n  @@index([status], map: \"idx_sms_messages_status\")\n  @@index([user_id], map: \"idx_sms_messages_user_id\")\n  @@map(\"sms_messages\")\n}\n\n/// This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\nmodel audit_logs {\n  id          String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  user_id     String?  @db.Uuid\n  action      String   @db.VarChar(50)\n  entity_type String   @db.VarChar(50)\n  entity_id   String?  @db.Uuid\n  old_values  Json?\n  new_values  Json?\n  ip_address  String?  @db.Inet\n  user_agent  String?\n  created_at  DateTime @default(now()) @db.Timestamptz(6)\n  users       User?    @relation(fields: [user_id], references: [id], onUpdate: NoAction)\n\n  @@index([action], map: \"idx_audit_logs_action\")\n  @@index([created_at], map: \"idx_audit_logs_created_at\")\n  @@index([entity_type, entity_id], map: \"idx_audit_logs_entity\")\n  @@index([user_id], map: \"idx_audit_logs_user_id\")\n}\n\nenum appointment_status {\n  scheduled\n  confirmed\n  completed\n  cancelled\n  no_show\n  rescheduled\n}\n\nenum appointment_type {\n  anc_visit\n  ultrasound\n  lab_test\n  specialist\n  delivery\n  postnatal\n  emergency\n}\n\nenum blood_type {\n  A_positive  @map(\"A+\")\n  A_negative  @map(\"A-\")\n  B_positive  @map(\"B+\")\n  B_negative  @map(\"B-\")\n  AB_positive @map(\"AB+\")\n  AB_negative @map(\"AB-\")\n  O_positive  @map(\"O+\")\n  O_negative  @map(\"O-\")\n  unknown\n}\n\nenum circle_permission {\n  view_health\n  view_location\n  receive_alerts\n  contribute_tokens\n}\n\nenum circle_role {\n  owner\n  partner\n  family\n  friend\n  doula\n}\n\nenum condition_status {\n  active\n  resolved\n  managed\n}\n\nenum condition_type {\n  chronic\n  pregnancy\n  allergy\n  medication\n  surgical\n  family_history\n}\n\nenum consent_type {\n  terms_of_service\n  privacy_policy\n  health_data_processing\n  marketing_communications\n  data_sharing_research\n  biometric_data\n}\n\nenum content_category {\n  pregnancy_basics\n  nutrition\n  exercise\n  mental_health\n  labor_delivery\n  breastfeeding\n  newborn_care\n  postpartum\n  danger_signs\n  family_planning\n}\n\nenum country_code {\n  ZA\n  UG\n  KE\n}\n\nenum facility_type {\n  hospital\n  clinic\n  health_center\n  pharmacy\n  laboratory\n  private_practice\n}\n\nenum language_code {\n  en\n  zu\n  xh\n  st\n  tn\n  lg\n  sw\n}\n\nenum milestone_category {\n  clinical\n  wellness\n  education\n  community\n}\n\nenum milestone_status {\n  locked\n  available\n  in_progress\n  pending_verification\n  completed\n  expired\n}\n\nenum otp_purpose {\n  registration\n  login\n  password_reset\n  phone_change\n  verification\n}\n\nenum partner_type {\n  mobile_money\n  transport\n  retail\n  healthcare\n  nutrition\n}\n\nenum pregnancy_status {\n  active\n  delivered\n  loss\n  terminated\n}\n\nenum product_category {\n  transport_voucher\n  mobile_money\n  data_bundle\n  nutrition_pack\n  pharmacy_voucher\n  clinic_credit\n  baby_supplies\n}\n\nenum question_type {\n  multiple_choice\n  true_false\n  multi_select\n}\n\nenum quiz_difficulty {\n  beginner\n  intermediate\n  advanced\n}\n\nenum redemption_status {\n  pending\n  processing\n  awaiting_burn\n  completed\n  failed\n  cancelled\n  expired\n}\n\nenum token_tx_status {\n  pending\n  processing\n  confirmed\n  failed\n}\n\nenum token_tx_type {\n  mint_milestone\n  mint_referral\n  mint_grant\n  burn_redemption\n  burn_expired\n  transfer_in\n  transfer_out\n}\n\nenum triage_level {\n  red\n  orange\n  yellow\n  green\n  blue\n}\n\nenum user_role {\n  mother\n  support\n  doula\n  chw\n  clinician\n  admin\n}\n\nenum user_status {\n  pending\n  active\n  suspended\n  deactivated\n}\n\nenum verification_type {\n  qr_scan\n  provider_signature\n  system_automatic\n  photo_proof\n  self_reported\n}\n\nenum verifier_type {\n  clinic\n  chw\n  digital_doula\n  system\n}\n",
  "inlineSchemaHash": "c6f985a0e912eb91d6818e852c8f763362c02f3af489994d41090fd42d497915",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":\"users\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phoneVerified\",\"dbName\":\"phone_verified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone_verified_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"country_code\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"language\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"language_code\",\"default\":\"en\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"user_status\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"user_role\",\"default\":\"mother\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"walletAddress\",\"dbName\":\"wallet_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"walletCreatedAt\",\"dbName\":\"wallet_created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastLoginAt\",\"dbName\":\"last_login_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"login_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"appointments_appointments_user_idTousers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Appointment\",\"relationName\":\"appointments_user_idTousers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appointments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Appointment\",\"relationName\":\"AppointmentToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"audit_logs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"audit_logs\",\"relationName\":\"UserToaudit_logs\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"circle_members_circle_members_invited_byTousers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CircleMember\",\"relationName\":\"circle_members_invited_byTousers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"circleMembers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CircleMember\",\"relationName\":\"CircleMemberToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Consent\",\"relationName\":\"ConsentToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"digital_doulas_digital_doulas_user_idTousers\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DigitalDoula\",\"relationName\":\"digital_doulas_user_idTousers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"digital_doulas_digital_doulas_verified_byTousers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DigitalDoula\",\"relationName\":\"digital_doulas_verified_byTousers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergency_contacts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EmergencyContact\",\"relationName\":\"EmergencyContactToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kick_sessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"KickSession\",\"relationName\":\"KickSessionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medical_history_medical_history_user_idTousers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MedicalHistory\",\"relationName\":\"medical_history_user_idTousers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medicalHistory\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MedicalHistory\",\"relationName\":\"MedicalHistoryToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notifications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Notification\",\"relationName\":\"NotificationToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancies\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pregnancy\",\"relationName\":\"PregnancyToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quizAttempts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"QuizAttempt\",\"relationName\":\"QuizAttemptToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"redemptions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Redemption\",\"relationName\":\"RedemptionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Session\",\"relationName\":\"SessionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sms_messages\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SmsMessage\",\"relationName\":\"SmsMessageToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"support_circles\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SupportCircle\",\"relationName\":\"SupportCircleToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tokenTransactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TokenTransaction\",\"relationName\":\"TokenTransactionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"milestones\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserMilestone\",\"relationName\":\"UserToUserMilestone\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"profile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserProfile\",\"relationName\":\"UserToUserProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifier\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Verifier\",\"relationName\":\"UserToVerifier\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserProfile\":{\"dbName\":\"user_profiles\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstNameEncrypted\",\"dbName\":\"first_name_encrypted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Bytes\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastNameEncrypted\",\"dbName\":\"last_name_encrypted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Bytes\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dateOfBirthEncrypted\",\"dbName\":\"date_of_birth_encrypted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Bytes\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatarUrl\",\"dbName\":\"avatar_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserProfile\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Consent\":{\"dbName\":\"consents\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consentType\",\"dbName\":\"consent_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"consent_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"version\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"granted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"grantedAt\",\"dbName\":\"granted_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revokedAt\",\"dbName\":\"revoked_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"dbName\":\"ip_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"dbName\":\"user_agent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ConsentToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"userId\",\"consentType\",\"version\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"userId\",\"consentType\",\"version\"]}],\"isGenerated\":false},\"Session\":{\"dbName\":\"sessions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deviceId\",\"dbName\":\"device_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"device_info\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"dbName\":\"ip_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refreshTokenHash\",\"dbName\":\"refresh_token_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"dbName\":\"expires_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"last_used_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SessionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"OtpCode\":{\"dbName\":\"otp_codes\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"codeHash\",\"dbName\":\"code_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purpose\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"otp_purpose\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attempts\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxAttempts\",\"dbName\":\"max_attempts\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":3,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"dbName\":\"expires_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verified_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Facility\":{\"dbName\":\"facilities\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"facility_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"country_code\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"latitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"longitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"website\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"operatingHours\",\"dbName\":\"operating_hours\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPartner\",\"dbName\":\"is_partner\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"partner_since\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accepts_tokens\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verificationCode\",\"dbName\":\"verification_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"appointments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Appointment\",\"relationName\":\"AppointmentToFacility\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancies\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pregnancy\",\"relationName\":\"FacilityToPregnancy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Verifier\",\"relationName\":\"FacilityToVerifier\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Pregnancy\":{\"dbName\":\"pregnancies\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"pregnancy_status\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"last_period_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimated_due_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conceptionDate\",\"dbName\":\"conception_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actual_delivery_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gravida\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isHighRisk\",\"dbName\":\"is_high_risk\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskFactors\",\"dbName\":\"risk_factors\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"risk_score\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bloodType\",\"dbName\":\"blood_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"blood_type\",\"default\":\"unknown\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"primaryFacilityId\",\"dbName\":\"primary_facility_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"appointments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Appointment\",\"relationName\":\"AppointmentToPregnancy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kickSessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"KickSession\",\"relationName\":\"KickSessionToPregnancy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medicalHistory\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MedicalHistory\",\"relationName\":\"MedicalHistoryToPregnancy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"primaryFacility\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Facility\",\"relationName\":\"FacilityToPregnancy\",\"relationFromFields\":[\"primaryFacilityId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"PregnancyToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"support_circles\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SupportCircle\",\"relationName\":\"PregnancyToSupportCircle\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"milestones\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserMilestone\",\"relationName\":\"PregnancyToUserMilestone\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"MedicalHistory\":{\"dbName\":\"medical_history\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancyId\",\"dbName\":\"pregnancy_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conditionType\",\"dbName\":\"condition_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"condition_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"condition_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"condition_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"condition_status\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"diagnosedDate\",\"dbName\":\"diagnosed_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolved_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notesEncrypted\",\"dbName\":\"notes_encrypted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Bytes\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedBy\",\"dbName\":\"verified_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedAt\",\"dbName\":\"verified_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"pregnancy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pregnancy\",\"relationName\":\"MedicalHistoryToPregnancy\",\"relationFromFields\":[\"pregnancyId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users_medical_history_user_idTousers\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"medical_history_user_idTousers\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifier\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"MedicalHistoryToUser\",\"relationFromFields\":[\"verifiedBy\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Appointment\":{\"dbName\":\"appointments\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancyId\",\"dbName\":\"pregnancy_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityId\",\"dbName\":\"facility_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appointment_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"appointment_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"appointment_status\",\"default\":\"scheduled\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduled_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration_minutes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":30,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reminder_sent_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verified_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedBy\",\"dbName\":\"verified_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verification_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"facility\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Facility\",\"relationName\":\"AppointmentToFacility\",\"relationFromFields\":[\"facilityId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pregnancy\",\"relationName\":\"AppointmentToPregnancy\",\"relationFromFields\":[\"pregnancyId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users_appointments_user_idTousers\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"appointments_user_idTousers\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifier\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"AppointmentToUser\",\"relationFromFields\":[\"verifiedBy\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"KickSession\":{\"dbName\":\"kick_sessions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancyId\",\"dbName\":\"pregnancy_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"start_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"end_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kickCount\",\"dbName\":\"kick_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"target_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":10,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"durationMinutes\",\"dbName\":\"duration_minutes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"alertTriggered\",\"dbName\":\"alert_triggered\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"alert_reason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pregnancy\",\"relationName\":\"KickSessionToPregnancy\",\"relationFromFields\":[\"pregnancyId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"KickSessionToUser\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"EmergencyContact\":{\"dbName\":\"emergency_contacts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relationship\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"EmergencyContactToUser\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"MilestoneDefinition\":{\"dbName\":\"milestone_definitions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"milestone_category\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"country_code\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rewardAmount\",\"dbName\":\"reward_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxClaimsPerPregnancy\",\"dbName\":\"max_claims_per_pregnancy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiresVerification\",\"dbName\":\"requires_verification\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verificationTypes\",\"dbName\":\"verification_types\",\"kind\":\"enum\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"verification_type\",\"default\":[\"qr_scan\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gestationalWeekMin\",\"dbName\":\"gestational_week_min\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gestationalWeekMax\",\"dbName\":\"gestational_week_max\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"days_to_complete\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"prerequisite_milestones\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sortOrder\",\"dbName\":\"sort_order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"quizzes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Quiz\",\"relationName\":\"MilestoneDefinitionToQuiz\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_milestones\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserMilestone\",\"relationName\":\"MilestoneDefinitionToUserMilestone\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"code\",\"country\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"code\",\"country\"]}],\"isGenerated\":false},\"UserMilestone\":{\"dbName\":\"user_milestones\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancyId\",\"dbName\":\"pregnancy_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"milestone_def_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"milestone_status\",\"default\":\"available\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"progress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"progressData\",\"dbName\":\"progress_data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startedAt\",\"dbName\":\"started_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"dbName\":\"completed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"dbName\":\"expires_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rewardAmount\",\"dbName\":\"reward_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reward_minted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reward_tx_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reward_minted_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"token_transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TokenTransaction\",\"relationName\":\"TokenTransactionToUserMilestone\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"milestone_definitions\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MilestoneDefinition\",\"relationName\":\"MilestoneDefinitionToUserMilestone\",\"relationFromFields\":[\"milestone_def_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pregnancy\",\"relationName\":\"PregnancyToUserMilestone\",\"relationFromFields\":[\"pregnancyId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserMilestone\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Verification\",\"relationName\":\"UserMilestoneToVerification\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"userId\",\"pregnancyId\",\"milestone_def_id\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"userId\",\"pregnancyId\",\"milestone_def_id\"]}],\"isGenerated\":false},\"Verifier\":{\"dbName\":\"verifiers\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityId\",\"dbName\":\"facility_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifier_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"verifier_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verificationCode\",\"dbName\":\"verification_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"credential_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"credential_verified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"total_verifications\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"verifications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Verification\",\"relationName\":\"VerificationToVerifier\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facility\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Facility\",\"relationName\":\"FacilityToVerifier\",\"relationFromFields\":[\"facilityId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToVerifier\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Verification\":{\"dbName\":\"verifications\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userMilestoneId\",\"dbName\":\"user_milestone_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifierId\",\"dbName\":\"verifier_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verificationType\",\"dbName\":\"verification_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"verification_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verificationHash\",\"dbName\":\"verification_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qrCodeData\",\"dbName\":\"qr_code_data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"signature\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Bytes\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"latitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"longitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verified_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userMilestone\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserMilestone\",\"relationName\":\"UserMilestoneToVerification\",\"relationFromFields\":[\"userMilestoneId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifier\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Verifier\",\"relationName\":\"VerificationToVerifier\",\"relationFromFields\":[\"verifierId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TokenTransaction\":{\"dbName\":\"token_transactions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"token_tx_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"token_tx_status\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tx_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stellar_tx_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"milestoneId\",\"dbName\":\"milestone_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"redemptionId\",\"dbName\":\"redemption_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errorMessage\",\"dbName\":\"error_message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"retryCount\",\"dbName\":\"retry_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_milestones\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserMilestone\",\"relationName\":\"TokenTransactionToUserMilestone\",\"relationFromFields\":[\"milestoneId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"redemption\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Redemption\",\"relationName\":\"RedemptionToTokenTransaction\",\"relationFromFields\":[\"redemptionId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"TokenTransactionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Partner\":{\"dbName\":\"partners\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"partner_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"country_code\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logoUrl\",\"dbName\":\"logo_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"api_endpoint\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"apiKeyEncrypted\",\"dbName\":\"api_key_encrypted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Bytes\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"webhookUrl\",\"dbName\":\"webhook_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"config\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"products\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PartnerProduct\",\"relationName\":\"PartnerToPartnerProduct\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"redemptions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Redemption\",\"relationName\":\"PartnerToRedemption\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PartnerProduct\":{\"dbName\":\"partner_products\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"partnerId\",\"dbName\":\"partner_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"product_category\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tokenCost\",\"dbName\":\"token_cost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"external_product_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"imageUrl\",\"dbName\":\"image_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_available\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stockQuantity\",\"dbName\":\"stock_quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"max_per_user_daily\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"max_per_user_monthly\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"partner\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Partner\",\"relationName\":\"PartnerToPartnerProduct\",\"relationFromFields\":[\"partnerId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"redemptions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RedemptionItem\",\"relationName\":\"PartnerProductToRedemptionItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Redemption\":{\"dbName\":\"redemptions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"partner_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"partner_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalTokens\",\"dbName\":\"total_tokens\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"redemption_status\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"external_ref\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"disbursement_ref\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recipient_phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recipient_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"burn_tx_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"burn_confirmed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"dbName\":\"completed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"error_message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"retry_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"dbName\":\"expires_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"items\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RedemptionItem\",\"relationName\":\"RedemptionToRedemptionItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"partners\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Partner\",\"relationName\":\"PartnerToRedemption\",\"relationFromFields\":[\"partner_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"RedemptionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TokenTransaction\",\"relationName\":\"RedemptionToTokenTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"RedemptionItem\":{\"dbName\":\"redemption_items\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"redemptionId\",\"dbName\":\"redemption_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"productId\",\"dbName\":\"product_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tokenCost\",\"dbName\":\"token_cost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"voucherCode\",\"dbName\":\"voucher_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"voucher_expires_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"product\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PartnerProduct\",\"relationName\":\"PartnerProductToRedemptionItem\",\"relationFromFields\":[\"productId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"redemption\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Redemption\",\"relationName\":\"RedemptionToRedemptionItem\",\"relationFromFields\":[\"redemptionId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SupportCircle\":{\"dbName\":\"support_circles\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"owner_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancy_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"My Support Circle\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"members\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CircleMember\",\"relationName\":\"CircleMemberToSupportCircle\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SupportCircleToUser\",\"relationFromFields\":[\"owner_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pregnancies\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pregnancy\",\"relationName\":\"PregnancyToSupportCircle\",\"relationFromFields\":[\"pregnancy_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CircleMember\":{\"dbName\":\"circle_members\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"circleId\",\"dbName\":\"circle_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"circle_role\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"permissions\",\"kind\":\"enum\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"circle_permission\",\"default\":[\"view_health\",\"receive_alerts\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invited_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invited_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accepted_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"circle\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SupportCircle\",\"relationName\":\"CircleMemberToSupportCircle\",\"relationFromFields\":[\"circleId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users_circle_members_invited_byTousers\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"circle_members_invited_byTousers\",\"relationFromFields\":[\"invited_by\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CircleMemberToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"circleId\",\"phone\"],[\"circleId\",\"userId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"circleId\",\"phone\"]},{\"name\":null,\"fields\":[\"circleId\",\"userId\"]}],\"isGenerated\":false},\"DigitalDoula\":{\"dbName\":\"digital_doulas\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"display_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatarUrl\",\"dbName\":\"avatar_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"specializations\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"languages\",\"kind\":\"enum\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"language_code\",\"default\":[\"en\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"years_experience\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"certifications\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rating\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"total_ratings\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"total_supports\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"total_tokens_earned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAvailable\",\"dbName\":\"is_available\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"max_active_mothers\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":10,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"current_active_mothers\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_verified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verified_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verified_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"users_digital_doulas_user_idTousers\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"digital_doulas_user_idTousers\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users_digital_doulas_verified_byTousers\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"digital_doulas_verified_byTousers\",\"relationFromFields\":[\"verified_by\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Article\":{\"dbName\":\"articles\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"summary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"content_category\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"country_code\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"language\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"language_code\",\"default\":\"en\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gestationalWeekMin\",\"dbName\":\"gestational_week_min\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gestationalWeekMax\",\"dbName\":\"gestational_week_max\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thumbnail_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"audioUrl\",\"dbName\":\"audio_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"read_time_mins\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"author\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"source\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"source_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPublished\",\"dbName\":\"is_published\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"publishedAt\",\"dbName\":\"published_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meta_title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meta_description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"slug\",\"language\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"slug\",\"language\"]}],\"isGenerated\":false},\"Quiz\":{\"dbName\":\"quizzes\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"content_category\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"difficulty\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"quiz_difficulty\",\"default\":\"beginner\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"country_code\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"language\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"language_code\",\"default\":\"en\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"time_limit_mins\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pass_threshold\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":70,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reward_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"milestone_def_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"attempts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"QuizAttempt\",\"relationName\":\"QuizToQuizAttempt\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"questions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"QuizQuestion\",\"relationName\":\"QuizToQuizQuestion\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"milestone_definitions\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MilestoneDefinition\",\"relationName\":\"MilestoneDefinitionToQuiz\",\"relationFromFields\":[\"milestone_def_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"QuizQuestion\":{\"dbName\":\"quiz_questions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quizId\",\"dbName\":\"quiz_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"questionText\",\"dbName\":\"question_text\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"questionType\",\"dbName\":\"question_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"question_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"options\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"correct_answer\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"explanation\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sortOrder\",\"dbName\":\"sort_order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quiz\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Quiz\",\"relationName\":\"QuizToQuizQuestion\",\"relationFromFields\":[\"quizId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"QuizAttempt\":{\"dbName\":\"quiz_attempts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quizId\",\"dbName\":\"quiz_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"score\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"answers\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"started_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"dbName\":\"completed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration_seconds\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rewardGranted\",\"dbName\":\"reward_granted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quiz\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Quiz\",\"relationName\":\"QuizToQuizAttempt\",\"relationFromFields\":[\"quizId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"QuizAttemptToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Notification\":{\"dbName\":\"notifications\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"body\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentAt\",\"dbName\":\"sent_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"delivered_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"readAt\",\"dbName\":\"read_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"NotificationToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SmsMessage\":{\"dbName\":\"sms_messages\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"template\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider_message_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentAt\",\"dbName\":\"sent_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveredAt\",\"dbName\":\"delivered_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"failed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SmsMessageToUser\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"audit_logs\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entity_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entity_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"old_values\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"new_values\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ip_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_agent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToaudit_logs\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments\"}},\"enums\":{\"appointment_status\":{\"values\":[{\"name\":\"scheduled\",\"dbName\":null},{\"name\":\"confirmed\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null},{\"name\":\"no_show\",\"dbName\":null},{\"name\":\"rescheduled\",\"dbName\":null}],\"dbName\":null},\"appointment_type\":{\"values\":[{\"name\":\"anc_visit\",\"dbName\":null},{\"name\":\"ultrasound\",\"dbName\":null},{\"name\":\"lab_test\",\"dbName\":null},{\"name\":\"specialist\",\"dbName\":null},{\"name\":\"delivery\",\"dbName\":null},{\"name\":\"postnatal\",\"dbName\":null},{\"name\":\"emergency\",\"dbName\":null}],\"dbName\":null},\"blood_type\":{\"values\":[{\"name\":\"A_positive\",\"dbName\":\"A+\"},{\"name\":\"A_negative\",\"dbName\":\"A-\"},{\"name\":\"B_positive\",\"dbName\":\"B+\"},{\"name\":\"B_negative\",\"dbName\":\"B-\"},{\"name\":\"AB_positive\",\"dbName\":\"AB+\"},{\"name\":\"AB_negative\",\"dbName\":\"AB-\"},{\"name\":\"O_positive\",\"dbName\":\"O+\"},{\"name\":\"O_negative\",\"dbName\":\"O-\"},{\"name\":\"unknown\",\"dbName\":null}],\"dbName\":null},\"circle_permission\":{\"values\":[{\"name\":\"view_health\",\"dbName\":null},{\"name\":\"view_location\",\"dbName\":null},{\"name\":\"receive_alerts\",\"dbName\":null},{\"name\":\"contribute_tokens\",\"dbName\":null}],\"dbName\":null},\"circle_role\":{\"values\":[{\"name\":\"owner\",\"dbName\":null},{\"name\":\"partner\",\"dbName\":null},{\"name\":\"family\",\"dbName\":null},{\"name\":\"friend\",\"dbName\":null},{\"name\":\"doula\",\"dbName\":null}],\"dbName\":null},\"condition_status\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"resolved\",\"dbName\":null},{\"name\":\"managed\",\"dbName\":null}],\"dbName\":null},\"condition_type\":{\"values\":[{\"name\":\"chronic\",\"dbName\":null},{\"name\":\"pregnancy\",\"dbName\":null},{\"name\":\"allergy\",\"dbName\":null},{\"name\":\"medication\",\"dbName\":null},{\"name\":\"surgical\",\"dbName\":null},{\"name\":\"family_history\",\"dbName\":null}],\"dbName\":null},\"consent_type\":{\"values\":[{\"name\":\"terms_of_service\",\"dbName\":null},{\"name\":\"privacy_policy\",\"dbName\":null},{\"name\":\"health_data_processing\",\"dbName\":null},{\"name\":\"marketing_communications\",\"dbName\":null},{\"name\":\"data_sharing_research\",\"dbName\":null},{\"name\":\"biometric_data\",\"dbName\":null}],\"dbName\":null},\"content_category\":{\"values\":[{\"name\":\"pregnancy_basics\",\"dbName\":null},{\"name\":\"nutrition\",\"dbName\":null},{\"name\":\"exercise\",\"dbName\":null},{\"name\":\"mental_health\",\"dbName\":null},{\"name\":\"labor_delivery\",\"dbName\":null},{\"name\":\"breastfeeding\",\"dbName\":null},{\"name\":\"newborn_care\",\"dbName\":null},{\"name\":\"postpartum\",\"dbName\":null},{\"name\":\"danger_signs\",\"dbName\":null},{\"name\":\"family_planning\",\"dbName\":null}],\"dbName\":null},\"country_code\":{\"values\":[{\"name\":\"ZA\",\"dbName\":null},{\"name\":\"UG\",\"dbName\":null},{\"name\":\"KE\",\"dbName\":null}],\"dbName\":null},\"facility_type\":{\"values\":[{\"name\":\"hospital\",\"dbName\":null},{\"name\":\"clinic\",\"dbName\":null},{\"name\":\"health_center\",\"dbName\":null},{\"name\":\"pharmacy\",\"dbName\":null},{\"name\":\"laboratory\",\"dbName\":null},{\"name\":\"private_practice\",\"dbName\":null}],\"dbName\":null},\"language_code\":{\"values\":[{\"name\":\"en\",\"dbName\":null},{\"name\":\"zu\",\"dbName\":null},{\"name\":\"xh\",\"dbName\":null},{\"name\":\"st\",\"dbName\":null},{\"name\":\"tn\",\"dbName\":null},{\"name\":\"lg\",\"dbName\":null},{\"name\":\"sw\",\"dbName\":null}],\"dbName\":null},\"milestone_category\":{\"values\":[{\"name\":\"clinical\",\"dbName\":null},{\"name\":\"wellness\",\"dbName\":null},{\"name\":\"education\",\"dbName\":null},{\"name\":\"community\",\"dbName\":null}],\"dbName\":null},\"milestone_status\":{\"values\":[{\"name\":\"locked\",\"dbName\":null},{\"name\":\"available\",\"dbName\":null},{\"name\":\"in_progress\",\"dbName\":null},{\"name\":\"pending_verification\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"expired\",\"dbName\":null}],\"dbName\":null},\"otp_purpose\":{\"values\":[{\"name\":\"registration\",\"dbName\":null},{\"name\":\"login\",\"dbName\":null},{\"name\":\"password_reset\",\"dbName\":null},{\"name\":\"phone_change\",\"dbName\":null},{\"name\":\"verification\",\"dbName\":null}],\"dbName\":null},\"partner_type\":{\"values\":[{\"name\":\"mobile_money\",\"dbName\":null},{\"name\":\"transport\",\"dbName\":null},{\"name\":\"retail\",\"dbName\":null},{\"name\":\"healthcare\",\"dbName\":null},{\"name\":\"nutrition\",\"dbName\":null}],\"dbName\":null},\"pregnancy_status\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"delivered\",\"dbName\":null},{\"name\":\"loss\",\"dbName\":null},{\"name\":\"terminated\",\"dbName\":null}],\"dbName\":null},\"product_category\":{\"values\":[{\"name\":\"transport_voucher\",\"dbName\":null},{\"name\":\"mobile_money\",\"dbName\":null},{\"name\":\"data_bundle\",\"dbName\":null},{\"name\":\"nutrition_pack\",\"dbName\":null},{\"name\":\"pharmacy_voucher\",\"dbName\":null},{\"name\":\"clinic_credit\",\"dbName\":null},{\"name\":\"baby_supplies\",\"dbName\":null}],\"dbName\":null},\"question_type\":{\"values\":[{\"name\":\"multiple_choice\",\"dbName\":null},{\"name\":\"true_false\",\"dbName\":null},{\"name\":\"multi_select\",\"dbName\":null}],\"dbName\":null},\"quiz_difficulty\":{\"values\":[{\"name\":\"beginner\",\"dbName\":null},{\"name\":\"intermediate\",\"dbName\":null},{\"name\":\"advanced\",\"dbName\":null}],\"dbName\":null},\"redemption_status\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"processing\",\"dbName\":null},{\"name\":\"awaiting_burn\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"failed\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null},{\"name\":\"expired\",\"dbName\":null}],\"dbName\":null},\"token_tx_status\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"processing\",\"dbName\":null},{\"name\":\"confirmed\",\"dbName\":null},{\"name\":\"failed\",\"dbName\":null}],\"dbName\":null},\"token_tx_type\":{\"values\":[{\"name\":\"mint_milestone\",\"dbName\":null},{\"name\":\"mint_referral\",\"dbName\":null},{\"name\":\"mint_grant\",\"dbName\":null},{\"name\":\"burn_redemption\",\"dbName\":null},{\"name\":\"burn_expired\",\"dbName\":null},{\"name\":\"transfer_in\",\"dbName\":null},{\"name\":\"transfer_out\",\"dbName\":null}],\"dbName\":null},\"triage_level\":{\"values\":[{\"name\":\"red\",\"dbName\":null},{\"name\":\"orange\",\"dbName\":null},{\"name\":\"yellow\",\"dbName\":null},{\"name\":\"green\",\"dbName\":null},{\"name\":\"blue\",\"dbName\":null}],\"dbName\":null},\"user_role\":{\"values\":[{\"name\":\"mother\",\"dbName\":null},{\"name\":\"support\",\"dbName\":null},{\"name\":\"doula\",\"dbName\":null},{\"name\":\"chw\",\"dbName\":null},{\"name\":\"clinician\",\"dbName\":null},{\"name\":\"admin\",\"dbName\":null}],\"dbName\":null},\"user_status\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"active\",\"dbName\":null},{\"name\":\"suspended\",\"dbName\":null},{\"name\":\"deactivated\",\"dbName\":null}],\"dbName\":null},\"verification_type\":{\"values\":[{\"name\":\"qr_scan\",\"dbName\":null},{\"name\":\"provider_signature\",\"dbName\":null},{\"name\":\"system_automatic\",\"dbName\":null},{\"name\":\"photo_proof\",\"dbName\":null},{\"name\":\"self_reported\",\"dbName\":null}],\"dbName\":null},\"verifier_type\":{\"values\":[{\"name\":\"clinic\",\"dbName\":null},{\"name\":\"chw\",\"dbName\":null},{\"name\":\"digital_doula\",\"dbName\":null},{\"name\":\"system\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

