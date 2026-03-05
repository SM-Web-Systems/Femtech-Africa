
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  detectRuntime,
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        const runtime = detectRuntime()
        const edgeRuntimeName = {
          'workerd': 'Cloudflare Workers',
          'deno': 'Deno and Deno Deploy',
          'netlify': 'Netlify Edge Functions',
          'edge-light': 'Vercel Edge Functions or Edge Middleware',
        }[runtime]

        let message = 'PrismaClient is unable to run in '
        if (edgeRuntimeName !== undefined) {
          message += edgeRuntimeName + '. As an alternative, try Accelerate: https://pris.ly/d/accelerate.'
        } else {
          message += 'this browser environment, or has been bundled for the browser (running in `' + runtime + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
