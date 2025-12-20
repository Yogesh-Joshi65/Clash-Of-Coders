const express = require('express');
const router = express.Router();
// Import all functions, including runCode
const { createRoom, startGame, submitCode, runCode } = require('../controllers/gameController');

router.post('/create', createRoom);
router.post('/start', startGame);
router.post('/submit', submitCode);
router.post('/run', runCode); // This endpoint triggered the error before

module.exports = router;