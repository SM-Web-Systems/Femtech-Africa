require('dotenv').config();
console.log('DATABASE_URL at start:', !!process.env.DATABASE_URL);
const { PrismaClient } = require('./generated/prisma-client');
const prisma = new PrismaClient();
setTimeout(() => {
  console.log('DATABASE_URL before query:', !!process.env.DATABASE_URL);
  prisma.facility.findMany()
    .then(r => console.log('SUCCESS:', r.length))
    .catch(e => console.log('FAIL:', e.message.substring(0, 150)));
}, 2000);
