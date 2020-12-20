const express = require('express');

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
router.post('/', addQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;
