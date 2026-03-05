const StellarSdk = require('@stellar/stellar-sdk');

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const DISTRIBUTOR_SECRET = 'SDD3D5XDOIIZ4Y2T47BD3SZXUPLVW6QH46XTBUSCHDZDGGONBETP3AIM';
const ISSUER_PUBLIC = 'GA5CGTJ6X4HZVQB6PEZNFRVU2V3KRLXVALV7QGXYT6XAIUNGNSM6FZ6V';
const ASSET_CODE = 'MAMA';

const server = new StellarSdk.Horizon.Server(HORIZON_URL);
const distributorKeypair = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);
const MAMA = new StellarSdk.Asset(ASSET_CODE, ISSUER_PUBLIC);

async function mintToUser(userPublicKey, amount, memo = '') {
  console.log(`\nMinting ${amount} MAMA to ${userPublicKey}...`);

  try {
    const distributorAccount = await server.loadAccount(distributorKeypair.publicKey());
    
    let txBuilder = new StellarSdk.TransactionBuilder(distributorAccount, {
      fee: '100',
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: userPublicKey,
        asset: MAMA,
        amount: amount.toString()
      }))
      .setTimeout(30);

    if (memo) {
      txBuilder = txBuilder.addMemo(StellarSdk.Memo.text(memo));
    }

    const tx = txBuilder.build();
    tx.sign(distributorKeypair);
    
    const result = await server.submitTransaction(tx);
    console.log('Success! Hash:', result.hash);
    return { success: true, hash: result.hash };

  } catch (error) {
    const errorCode = error.response?.data?.extras?.result_codes;
    console.error('Error:', errorCode || error.message);
    return { success: false, error: errorCode || error.message };
  }
}

// Export for use in API
module.exports = { mintToUser, MAMA, server };

// Test if run directly
if (require.main === module) {
  const testUser = process.argv[2];
  const amount = process.argv[3] || '100';
  
  if (!testUser) {
    console.log('Usage: node mint-to-user.js <USER_PUBLIC_KEY> [AMOUNT]');
    console.log('Example: node mint-to-user.js GXXXXX... 100');
  } else {
    mintToUser(testUser, amount, 'Milestone reward');
  }
}
