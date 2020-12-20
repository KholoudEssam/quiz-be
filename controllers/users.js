const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
    const users = await User.find();
    console.log(users);
    res.status(200).send(users);
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return next(
                new ErrorResponse(`ID ${req.params.id} is not exist`, 404)
            );

        res.status(200).send(user);
    } catch (error) {
        next(new ErrorResponse(`Invalid ID ${req.params.id}`, 400));
    }
};

exports.addUser = async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).send(user);
};

exports.updateUser = async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).send(user);
};

exports.deleteUser = async (req, res, next) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send({ message: 'Not found' });

    res.status(200).send({ message: 'Deleted!' });
};
