const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        //only if role is admin to recieve email after test completion
        type: String,
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student',
    },
});

module.exports = mongoose.model('User', userSchema);
