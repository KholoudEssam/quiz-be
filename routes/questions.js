const express = require('express');
const { protected, authorize } = require('../middlewares/auth');

const {
    getQuestions,
    getQuestion,
    addQuestion,
    updateQuestion,
    deleteQuestion,
} = require('../controllers/questions');
const router = express.Router();

router.get('/', protected, getQuestions);
router.get('/:id', protected, getQuestion);
router.post('/', protected, authorize, addQuestion);
router.put('/:id', protected, authorize, updateQuestion);
router.delete('/:id', protected, authorize, deleteQuestion);

module.exports = router;
