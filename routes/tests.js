const express = require('express');
const {
    protected,
    authorizeStudent,
    authorize,
} = require('../middlewares/auth');
const {
    getUsersTest,
    generateTest,
    correctTest,
    getTest,
    deleteTest,
} = require('../controllers/tests');
const router = express.Router();

router.get('/users-tests', protected, getUsersTest);
router.get('/generate', protected, authorizeStudent, generateTest);
router.post('/correct', protected, authorizeStudent, correctTest);
router.get('/:id', protected, getTest);
router.delete('/:id', protected, authorize, deleteTest);

module.exports = router;
