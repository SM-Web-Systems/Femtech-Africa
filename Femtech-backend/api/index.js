require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.set('trust proxy', 1);
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const milestonesRoutes = require('./routes/milestones');
const redemptionsRoutes = require('./routes/redemptions');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const quizzesRoutes = require('./routes/quizzes');
const aiAgentRoutes = require('./routes/ai-agent');
const riskAssessmentRoutes = require('./routes/risk-assessment');
const recommendationsRoutes = require('./routes/recommendations');

app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/milestones', milestonesRoutes);
app.use('/api/v1/redemptions', redemptionsRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/quizzes', quizzesRoutes);
app.use('/api/v1/ai', aiAgentRoutes);
app.use('/api/v1/risk', riskAssessmentRoutes);
app.use('/api/v1/recommendations', recommendationsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MamaTokens API running on port ${PORT}`);
});
