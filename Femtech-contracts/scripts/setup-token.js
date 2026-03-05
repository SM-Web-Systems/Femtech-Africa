const StellarSdk = require('@stellar/stellar-sdk');
require('dotenv').config({ path: '/home/christopher-fourquier/Femtech-Africa/.env' });

const server = new StellarSdk.Horizon.Server(process.env.STELLAR_HORIZON_URL);

const issuerKeypair = StellarSdk.Keypair.fromSecret(process.env.STELLAR_ISSUER_SECRET);
const distributorKeypair = StellarSdk.Keypair.fromSecret(process.env.STELLAR_DISTRIBUTOR_SECRET);

const MAMA = new StellarSdk.Asset(process.env.STELLAR_ASSET_CODE, issuerKeypair.publicKey());

async function setupToken() {
  console.log('=== MAMA TOKEN SETUP ===\n');
  console.log('Asset Code:', process.env.STELLAR_ASSET_CODE);
  console.log('Issuer:', issuerKeypair.publicKey());
  console.log('Distributor:', distributorKeypair.publicKey());
  console.log('');

  try {
    // Step 1: Create trustline from distributor to issuer
    console.log('Step 1: Creating trustline from distributor...');
    const distributorAccount = await server.loadAccount(distributorKeypair.publicKey());
    
    const trustlineTx = new StellarSdk.TransactionBuilder(distributorAccount, {
      fee: '100',
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.changeTrust({
        asset: MAMA,
        limit: '1000000000'
      }))
      .setTimeout(30)
      .build();

    trustlineTx.sign(distributorKeypair);
    const trustlineResult = await server.submitTransaction(trustlineTx);
    console.log('Trustline created! Hash:', trustlineResult.hash);

    // Step 2: Mint initial tokens to distributor
    console.log('\nStep 2: Minting initial tokens to distributor...');
    const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
    
    const mintTx = new StellarSdk.TransactionBuilder(issuerAccount, {
      fee: '100',
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: distributorKeypair.publicKey(),
        asset: MAMA,
        amount: '10000000'
      }))
      .setTimeout(30)
      .build();

    mintTx.sign(issuerKeypair);
    const mintResult = await server.submitTransaction(mintTx);
    console.log('Tokens minted! Hash:', mintResult.hash);

    // Step 3: Verify balances
    console.log('\nStep 3: Verifying balances...');
    const updatedDistributor = await server.loadAccount(distributorKeypair.publicKey());
    const mamaBalance = updatedDistributor.balances.find(b => 
      b.asset_code === process.env.STELLAR_ASSET_CODE && 
      b.asset_issuer === issuerKeypair.publicKey()
    );
    
    console.log('\n=== SETUP COMPLETE ===');
    console.log('MAMA Token Balance:', mamaBalance ? mamaBalance.balance : '0');
    console.log('View on Stellar Expert: https://stellar.expert/explorer/testnet/asset/' + 
      process.env.STELLAR_ASSET_CODE + '-' + issuerKeypair.publicKey());

  } catch (error) {
    console.error('Error:', error.response?.data?.extras?.result_codes || error.message);
  }
}

setupToken();
