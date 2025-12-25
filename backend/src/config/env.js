const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

function readEnv(key) {
  // Be tolerant of accidental trailing spaces in variable names in .env
  const direct = process.env[key];
  const withSpace = process.env[`${key} `];
  const value = direct || withSpace || '';
  return typeof value === 'string' ? value.trim() : value;
}

module.exports = {
  PORT: readEnv('PORT') || 5000,
  NODE_ENV: readEnv('NODE_ENV') || 'development',
  GEMINI_API_KEY: readEnv('GEMINI_API_KEY'),
  WANDB_API_KEY: readEnv('WANDB_API_KEY'),
};
