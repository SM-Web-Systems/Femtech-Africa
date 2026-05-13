const crypto = require('crypto');
const QRCode = require('qrcode');

function generateVoucherCode(prefix = 'MAMA') {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

async function generateQRCode(data) {
  try {
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(data), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: { dark: '#E91E63', light: '#FFFFFF' },
    });
    return qrDataUrl;
  } catch (error) {
    console.error('QR generation error:', error);
    return null;
  }
}

function generateBarcode() {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

function calculateVoucherValue(tokenAmount, exchangeRate = 0.10) {
  return parseFloat((tokenAmount * exchangeRate).toFixed(2));
}

function getExpiryDate(days = 30) {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}

module.exports = {
  generateVoucherCode,
  generateQRCode,
  generateBarcode,
  calculateVoucherValue,
  getExpiryDate,
};
