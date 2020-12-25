const express = require('express');
const { protected, authorizeStudent } = require('../middlewares/auth');
const { generateTest, correctTest } = require('../controllers/tests');
const router = express.Router();

router.get('/generate', protected, authorizeStudent, generateTest);
router.post('/correct', protected, authorizeStudent, correctTest);

module.exports = router;
