const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    totalGrade: {
        type: Number,
        default: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    questionsData: [
        {
            questionId: { type: mongoose.Schema.ObjectId, ref: 'Question' },
            correctAns: String,
        },
    ],
});

module.exports = mongoose.model('Test', testSchema);
