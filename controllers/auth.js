const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/user');

exports.login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password)
        return next(
            new ErrorResponse(`Please enter username and password`, 400)
        );

    const user = await User.findOne({ username }).select('+password');
    if (!user) return next(new ErrorResponse(`Invalid credentials`, 401));

    const isMatched = await user.matchPasswords(password);
    if (!isMatched) return next(new ErrorResponse(`Invalid credentials`, 401));

    const token = await user.getToken();

    res.status(200).send({
        token,
        userId: user._id,
        role: user.role,
        username: user.username,
    });
});
