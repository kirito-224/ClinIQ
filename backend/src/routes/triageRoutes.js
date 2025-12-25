const express = require('express');
const router = express.Router();
const safetyCheck = require('../middleware/safetyCheck');
const { handleTriage } = require('../controllers/triageController');

// POST /api/triage
// 1. Run safety checks (detect emergencies)
// 2. If safe, run AI triage
router.post('/triage', safetyCheck, handleTriage);

module.exports = router;
