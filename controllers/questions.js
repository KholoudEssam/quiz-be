const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Question = require('../models/question');

exports.getQuestions = asyncHandler(async (req, res, next) => {
    const quests = await Question.find();

    res.status(200).send({ QuestionsNumber: quests.length, quests });
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
    req.body.adminID = req.user._id;
    const quest = await Question.create(req.body);

    res.status(201).send(quest);
});

exports.updateQuestion = asyncHandler(async (req, res, next) => {
    let quest = await Question.findById(req.params.id);
    if (!quest)
        return next(
            new ErrorResponse(
                `Question with ID ${req.params.id} is not exist`,
                404
            )
        );
    //Only admin who adds this question can edit it
    if (quest.adminID.toString() !== req.user._id.toString()) {
        return next(
            new ErrorResponse(`Not allowed to edit this question`, 403)
        );
    }
    quest = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).send(quest);
});

exports.deleteQuestion = asyncHandler(async (req, res, next) => {
    let quest = await Question.findById(req.params.id);
    if (!quest)
        return next(
            new ErrorResponse(
                `Question with ID ${req.params.id} is not exist`,
                404
            )
        );
    //Only admin who adds this question can delete it
    if (quest.adminID.toString() !== req.user._id.toString()) {
        return next(
            new ErrorResponse(`Not allowed to delete this question`, 403)
        );
    }

    await Question.findByIdAndRemove(req.params.id);

    res.status(200).send({ message: 'Deleted!' });
});
