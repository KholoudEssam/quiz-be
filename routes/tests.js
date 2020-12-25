const express = require('express');

const { generateTest, correctTest } = require('../controllers/tests');
const router = express.Router();

router.get('/generate', generateTest);
router.post('/correct', correctTest);

module.exports = router;
