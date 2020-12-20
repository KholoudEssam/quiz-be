const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        //only if role is admin to recieve email after test completion
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student',
    },
});

module.exports = mongoose.model('User', userSchema);
