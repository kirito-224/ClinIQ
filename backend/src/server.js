const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const triageRoutes = require('./routes/triageRoutes');

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', triageRoutes);

// Basic health check (text)
app.get('/', (req, res) => {
  res.send('ClinIQ API is running. POST to /api/triage to start.');
});

// JSON health / config check (no secrets)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    port: config.PORT,
    services: {
      gemini: {
        hasApiKey: Boolean(config.GEMINI_API_KEY),
      },
    },
  });
});

// Start server
app.listen(config.PORT, () => {
  console.log(`ClinIQ Backend running on port ${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
  console.log('GEMINI_API_KEY present?', !!config.GEMINI_API_KEY);
  console.log('Health endpoint: GET /api/health');
});
