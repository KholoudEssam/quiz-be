const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/user');

exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().sort({ role: 1 });
    res.status(200).send(users);
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user)
        return next(
            new ErrorResponse(`User with ID ${req.params.id} is not exist`, 404)
        );

    res.status(200).send(user);
});

exports.addUser = asyncHandler(async (req, res, next) => {
    let user;
    //Admin must have an email
    if (req.body.role === 'admin' && !req.body.email)
        return next(new ErrorResponse(`Email is required`, 400));

    //check if email is already exist
    if (req.body.role === 'admin' && req.body.email) {
        user = await User.findOne({ email: req.body.email });
        if (user)
            return next(new ErrorResponse(`User is already registered`, 400));
    }
    user = await User.create(req.body);
    res.status(201).send(user);
});

// It is not allowed to edit or remove user 'admin'

exports.updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);
    if (!user)
        return next(
            new ErrorResponse(`User with ID ${req.params.id} is not exist`, 404)
        );
    if (user.role === 'admin' && user.username === 'admin')
        return next(
            new ErrorResponse(`You Can NOT update user ${user.username}`, 403)
        );
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).send(user);
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user)
        return next(
            new ErrorResponse(`User with ID ${req.params.id} is not exist`, 404)
        );
    if (user.role === 'admin' && user.username === 'admin')
        return next(
            new ErrorResponse(`You Can NOT delete user ${user.username}`, 403)
        );

    await User.findByIdAndRemove(req.params.id);

    res.status(200).send({ message: 'Deleted!' });
});
