require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const milestonesRoutes = require('./routes/milestones');
const redemptionsRoutes = require('./routes/redemptions');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const userRoutes = require('./routes/user');
const quizRoutes = require('./routes/quizzes');
const aiAgentRoutes = require('./routes/ai-agent');
const riskAssessmentRoutes = require('./routes/risk-assessment');
const recommendationsRoutes = require('./routes/recommendations');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
app.use('/api/v1', publicRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/milestones', milestonesRoutes);
app.use('/api/v1/mint', require('./routes/milestones'));
app.use('/api/v1/redemptions', redemptionsRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/my', userRoutes);
app.use('/api/v1/my/milestones', milestonesRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/ai', aiAgentRoutes);
app.use('/api/v1/risk', riskAssessmentRoutes);
app.use('/api/v1/recommendations', recommendationsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`MamaTokens API running on port ${PORT}`);
  console.log('Routes:');
  console.log('  Public: /api/v1/health, /facilities, /articles, /quizzes');
  console.log('  Auth: /api/v1/auth/otp/request, /otp/verify, /me');
  console.log('  Wallet: /api/v1/wallet/create, /balance, /import');
  console.log('  Milestones: /api/v1/milestones, /mint');
  console.log('  Redemptions: /api/v1/redemptions/partners, /redeem, /my/vouchers');
  console.log('  Profile: /api/v1/profile');
  console.log('  User: /api/v1/my/pregnancies, /appointments, /transactions');
  console.log('  Admin: /api/v1/admin/login, /stats, /users, /transactions');
  console.log('  Quizzes: /api/v1/quizzes, /quizzes/:id/start, /quizzes/:id/submit');
});
