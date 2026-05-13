const StellarSdk = require('@stellar/stellar-sdk');
const crypto = require('crypto');

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

const ISSUER_SECRET = process.env.STELLAR_ISSUER_SECRET;
const ISSUER_PUBLIC = process.env.STELLAR_ISSUER_PUBLIC;
const DISTRIBUTOR_SECRET = process.env.STELLAR_DISTRIBUTOR_SECRET;
const DISTRIBUTOR_PUBLIC = process.env.STELLAR_DISTRIBUTOR_PUBLIC;
const ASSET_CODE = 'MAMA';
const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY || process.env.JWT_SECRET;

// Encryption helpers
function encrypt(text) {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  return Buffer.concat([iv, authTag, Buffer.from(encrypted, 'hex')]);
}

function decrypt(encryptedBuffer) {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  
  const iv = encryptedBuffer.slice(0, 16);
  const authTag = encryptedBuffer.slice(16, 32);
  const encrypted = encryptedBuffer.slice(32);
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, null, 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

async function createWallet() {
  const keypair = StellarSdk.Keypair.random();
  const publicKey = keypair.publicKey();
  const secretKey = keypair.secret();

  try {
    // Fund with friendbot (testnet only)
    await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    
    // Load account and add trustline
    const account = await server.loadAccount(publicKey);
    const mamaAsset = new StellarSdk.Asset(ASSET_CODE, ISSUER_PUBLIC);
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase
    })
      .addOperation(StellarSdk.Operation.changeTrust({
        asset: mamaAsset,
        limit: '1000000'
      }))
      .setTimeout(30)
      .build();

    transaction.sign(keypair);
    await server.submitTransaction(transaction);

    // Encrypt secret key for storage
    const encryptedSecret = encrypt(secretKey);

    return { publicKey, secretKey, encryptedSecret };
  } catch (error) {
    console.error('Create wallet error:', error);
    throw error;
  }
}

async function importWallet(secretKey) {
  try {
    const keypair = StellarSdk.Keypair.fromSecret(secretKey);
    const publicKey = keypair.publicKey();
    
    // Check if account exists
    await server.loadAccount(publicKey);
    
    // Encrypt secret key for storage
    const encryptedSecret = encrypt(secretKey);
    
    return { publicKey, secretKey, encryptedSecret };
  } catch (error) {
    console.error('Import wallet error:', error);
    throw error;
  }
}

async function getBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    let xlmBalance = '0';
    let mamaBalance = '0';

    account.balances.forEach(balance => {
      if (balance.asset_type === 'native') {
        xlmBalance = balance.balance;
      } else if (balance.asset_code === ASSET_CODE && balance.asset_issuer === ISSUER_PUBLIC) {
        mamaBalance = balance.balance;
      }
    });

    return { xlmBalance, mamaBalance };
  } catch (error) {
    console.error('Get balance error:', error);
    return { xlmBalance: '0', mamaBalance: '0' };
  }
}

async function mintTokens(userPublicKey, amount) {
  try {
    const distributorKeypair = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);
    const account = await server.loadAccount(DISTRIBUTOR_PUBLIC);
    const mamaAsset = new StellarSdk.Asset(ASSET_CODE, ISSUER_PUBLIC);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: userPublicKey,
        asset: mamaAsset,
        amount: amount.toString()
      }))
      .setTimeout(30)
      .build();

    transaction.sign(distributorKeypair);
    const result = await server.submitTransaction(transaction);
    
    return { success: true, txHash: result.hash };
  } catch (error) {
    console.error('Mint tokens error:', error);
    return { success: false, error: error.message };
  }
}

// Burn tokens using encrypted secret key from database
async function burnTokens(encryptedSecret, amount) {
  try {
    // Decrypt the secret key
    const secretKey = decrypt(encryptedSecret);
    
    const userKeypair = StellarSdk.Keypair.fromSecret(secretKey);
    const userPublic = userKeypair.publicKey();
    const account = await server.loadAccount(userPublic);
    const mamaAsset = new StellarSdk.Asset(ASSET_CODE, ISSUER_PUBLIC);

    // Send tokens back to distributor (effectively burning them)
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: DISTRIBUTOR_PUBLIC,
        asset: mamaAsset,
        amount: amount.toString()
      }))
      .setTimeout(30)
      .build();

    transaction.sign(userKeypair);
    const result = await server.submitTransaction(transaction);
    
    return { success: true, txHash: result.hash };
  } catch (error) {
    console.error('Burn tokens error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { 
  createWallet, 
  importWallet, 
  getBalance, 
  mintTokens, 
  burnTokens,
  encrypt,
  decrypt,
  server, 
  ASSET_CODE, 
  ISSUER_PUBLIC 
};
