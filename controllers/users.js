const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/user');

exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
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
    const user = await User.create(req.body);
    res.status(201).send(user);
});

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!user)
        return next(
            new ErrorResponse(`User with ID ${req.params.id} is not exist`, 404)
        );

    res.status(200).send(user);
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user)
        return next(
            new ErrorResponse(`User with ID ${req.params.id} is not exist`, 404)
        );

    res.status(200).send({ message: 'Deleted!' });
});
