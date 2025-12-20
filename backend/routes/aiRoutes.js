const express = require('express');
const router = express.Router();
const { analyzeCode } = require('../controllers/aiController');

// Route: POST /api/ai/analyze
router.post('/analyze', analyzeCode);

module.exports = router;