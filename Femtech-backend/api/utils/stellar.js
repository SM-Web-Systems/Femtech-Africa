const StellarSdk = require('@stellar/stellar-sdk');

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

const ISSUER_PUBLIC = process.env.ISSUER_PUBLIC_KEY;
const DISTRIBUTOR_SECRET = process.env.DISTRIBUTOR_SECRET_KEY;
const DISTRIBUTOR_PUBLIC = process.env.DISTRIBUTOR_PUBLIC_KEY;
const ASSET_CODE = 'MAMA';

async function createWallet() {
  const pair = StellarSdk.Keypair.random();
  const publicKey = pair.publicKey();
  const secretKey = pair.secret();

  // Fund with friendbot
  try {
    await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.log('Friendbot error:', error.message);
  }

  // Add trustline for MAMA
  try {
    const account = await server.loadAccount(publicKey);
    const mamaAsset = new StellarSdk.Asset(ASSET_CODE, ISSUER_PUBLIC);
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase
    })
      .addOperation(StellarSdk.Operation.changeTrust({ asset: mamaAsset }))
      .setTimeout(30)
      .build();

    transaction.sign(pair);
    await server.submitTransaction(transaction);
  } catch (error) {
    console.log('Trustline error:', error.message);
  }

  return { publicKey, secretKey };
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
    return { xlmBalance: '0', mamaBalance: '0' };
  }
}

async function mintTokens(destinationPublic, amount) {
  const distributorKeypair = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);
  const account = await server.loadAccount(DISTRIBUTOR_PUBLIC);
  const mamaAsset = new StellarSdk.Asset(ASSET_CODE, ISSUER_PUBLIC);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: destinationPublic,
      asset: mamaAsset,
      amount: amount.toString()
    }))
    .setTimeout(30)
    .build();

  transaction.sign(distributorKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}

async function burnTokens(userSecretKey, amount) {
  const userKeypair = StellarSdk.Keypair.fromSecret(userSecretKey);
  const userPublic = userKeypair.publicKey();
  const account = await server.loadAccount(userPublic);
  const mamaAsset = new StellarSdk.Asset(ASSET_CODE, ISSUER_PUBLIC);

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
  return result.hash;
}

module.exports = { createWallet, getBalance, mintTokens, burnTokens, server, ASSET_CODE, ISSUER_PUBLIC };
