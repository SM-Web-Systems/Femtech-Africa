const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
  }
  return Buffer.from(key, 'hex');
};

const encrypt = (text) => {
  if (!text) return null;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]);
};

const decrypt = (encryptedData) => {
  if (!encryptedData) return null;
  if (typeof encryptedData === 'string') return encryptedData;
  const data = Buffer.isBuffer(encryptedData) ? encryptedData : Buffer.from(encryptedData);
  if (data.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error('Invalid encrypted data');
  }
  const key = getEncryptionKey();
  const iv = data.slice(0, IV_LENGTH);
  const authTag = data.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = data.slice(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
};

const encryptProfile = (profile) => {
  return {
    firstNameEncrypted: profile.firstName ? encrypt(profile.firstName) : null,
    lastNameEncrypted: profile.lastName ? encrypt(profile.lastName) : null,
    dateOfBirthEncrypted: profile.dateOfBirth ? encrypt(profile.dateOfBirth) : null,
    avatarUrl: profile.avatarUrl || null
  };
};

const decryptProfile = (encryptedProfile) => {
  if (!encryptedProfile) return null;
  try {
    return {
      id: encryptedProfile.id,
      userId: encryptedProfile.userId,
      firstName: decrypt(encryptedProfile.firstNameEncrypted),
      lastName: decrypt(encryptedProfile.lastNameEncrypted),
      dateOfBirth: decrypt(encryptedProfile.dateOfBirthEncrypted),
      avatarUrl: encryptedProfile.avatarUrl,
      createdAt: encryptedProfile.createdAt,
      updatedAt: encryptedProfile.updatedAt
    };
  } catch (error) {
    console.error('Profile decryption error:', error.message);
    return {
      id: encryptedProfile.id,
      userId: encryptedProfile.userId,
      firstName: null,
      lastName: null,
      dateOfBirth: null,
      avatarUrl: encryptedProfile.avatarUrl
    };
  }
};

module.exports = { encrypt, decrypt, encryptProfile, decryptProfile };
