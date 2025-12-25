const express = require('express');
const router = express.Router();
const { handleTriage } = require('../controllers/triageController');
const safetyCheck = require('../middleware/safetyCheck');

// POST /api/triage
// 1. Run safety checks (detect heart attack etc.)
// 2. If safe, run AI triage
router.post('/triage', safetyCheck, handleTriage);

module.exports = router;
