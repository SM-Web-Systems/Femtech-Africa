module.exports = {
  apps: [{
    name: 'femtech-api',
    script: 'index.js',
    cwd: '/home/christopher-fourquier/Femtech-Africa/api',
    env: {
      DATABASE_URL: 'postgresql://femtech_prod:O1cyAwBe4RBt5qcvZsH7p6njZl8v4BBM7PU%2FYVQyMYY%3D@localhost:5432/femtech_prod',
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
