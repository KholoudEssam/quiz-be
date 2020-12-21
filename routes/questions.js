const express = require('express');
const { protected } = require('../middlewares/auth');

const {
    getQuestions,
    getQuestion,
    addQuestion,
    updateQuestion,
    deleteQuestion,
} = require('../controllers/questions');
const router = express.Router();

router.get('/', getQuestions);
router.get('/:id', getQuestion);
router.post('/', protected, addQuestion);
router.put('/:id', protected, updateQuestion);
router.delete('/:id', protected, deleteQuestion);

module.exports = router;
