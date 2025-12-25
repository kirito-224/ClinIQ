const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root if not found
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  WANDB_API_KEY: process.env.WANDB_API_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development'
};
