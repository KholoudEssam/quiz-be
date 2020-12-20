const mongoose = require('mongoose');

const qsSchema = new mongoose.Schema({
    head: {
        type: String,
        required: true,
    },
    firstChoice: {
        type: String,
        required: true,
    },
    secondChoice: {
        type: String,
        required: true,
    },
    thirdChoice: {
        type: String,
        required: true,
    },
    forthChoice: {
        type: String,
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    grade: {
        type: Number,
        default: 1,
    },
});

module.exports = mongoose.model('Question', qsSchema);
