module.exports = {
  apps: [{
    name: 'femtech-api',
    script: 'index.js',
    cwd: '/home/christopher-fourquier/Femtech-Africa/Femtech-backend/api',
    node_args: '-r dotenv/config',
    env: {
      DATABASE_URL: 'postgresql://femtech_prod:O1cyAwBe4RBt5qcvZsH7p6njZl8v4BBM7PU%2FYVQyMYY%3D@localhost:5432/femtech_prod',
      JWT_SECRET: 'femtech-africa-super-secret-key-2026',
      PORT: 3001,
      NODE_ENV: 'production'
    }
  }]
};
