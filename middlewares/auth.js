const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
const User = require('../models/user');

exports.protected = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    let token;
    if (authorization && authorization.startsWith('Bearer'))
        token = authorization.split(' ')[1];
    if (!token)
        return next(
            new ErrorResponse('Not authorized to access this route', 401)
        );
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //get the logged in user and store it in the req
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        next(new ErrorResponse('invalid token', 400));
    }
});
// Grant access to specific role (admin)
exports.authorize = (req, res, next) => {
    if (!(req.user.role === 'admin')) {
        return next(
            new ErrorResponse(
                `User role '${req.user.role}' can not access this route`,
                403
            )
        );
    }
    next();
};

exports.authorizeStudent = (req, res, next) => {
    if (!(req.user.role === 'student')) {
        return next(
            new ErrorResponse(
                `User role '${req.user.role}' can not access this route`,
                403
            )
        );
    }
    next();
};
