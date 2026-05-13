require('dotenv').config();
console.log('ENV:', !!process.env.DATABASE_URL);
require('./routes/public');
console.log('OK');
