const mongoose = require('mongoose');

const qsSchema = new mongoose.Schema({
    head: {
        type: String,
        required: [true, 'Question head is required'],
        unique: true,
    },
    firstChoice: {
        type: String,
        required: [true, 'first choice is required'],
    },
    secondChoice: {
        type: String,
        required: [true, 'second choice is required'],
    },
    thirdChoice: {
        type: String,
        required: [true, 'third choice is required'],
    },
    forthChoice: {
        type: String,
        required: [true, 'forth choice is required'],
    },
    correctAnswer: {
        type: String,
        required: [true, 'the correct choice is required'],
    },
    grade: {
        type: Number,
        default: 1,
    },
    adminID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('Question', qsSchema);
