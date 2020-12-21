const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Question = require('../models/question');

exports.getQuestions = asyncHandler(async (req, res, next) => {
    const quests = await Question.find();
    res.status(200).send(quests);
});

exports.getQuestion = asyncHandler(async (req, res, next) => {
    const quest = await Question.findById(req.params.id);
    if (!quest)
        return next(
            new ErrorResponse(
                `Question with ID ${req.params.id} is not exist`,
                404
            )
        );

    res.status(200).send(quest);
});

exports.addQuestion = asyncHandler(async (req, res, next) => {
    const quest = await Question.create(req.body);

    res.status(201).send(quest);
});

exports.updateQuestion = asyncHandler(async (req, res, next) => {
    const quest = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!quest)
        return next(
            new ErrorResponse(
                `Question with ID ${req.params.id} is not exist`,
                404
            )
        );
    res.status(200).send(quest);
});

exports.deleteQuestion = asyncHandler(async (req, res, next) => {
    const quest = await Question.findByIdAndRemove(req.params.id);
    if (!quest)
        return next(
            new ErrorResponse(
                `Question with ID ${req.params.id} is not exist`,
                404
            )
        );

    res.status(200).send({ message: 'Deleted!' });
});
