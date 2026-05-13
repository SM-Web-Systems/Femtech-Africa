require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const publicRoutes = require('./routes/public');
app.use('/api/v1/public', publicRoutes);
app.listen(3099, () => {
  console.log('Test server on 3099');
});
