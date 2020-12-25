const mongoose = require('mongoose');

const userTestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    testId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Test',
    },
    userGrade: {
        type: Number,
    },
    questionsData: [
        {
            qsId: { type: mongoose.Schema.ObjectId, ref: 'Question' },
            userAns: String,
            correctAns: String,
            questionHead: String,
        },
    ],
});

module.exports = mongoose.model('UserTest', userTestSchema);
