const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const triageRoutes = require('./routes/triageRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', triageRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('ClinIQ API is running. POST to /api/triage to start.');
});

// Start Server
app.listen(config.PORT, () => {
    console.log(`ClinIQ Backend running on port ${config.PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
});
