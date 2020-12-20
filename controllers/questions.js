const Question = require('../models/question');

exports.getQuestions = async (req, res, next) => {
    const quests = await Question.find();

    res.status(200).send(quests);
};

exports.getQuestion = async (req, res, next) => {
    const quest = await Question.findById(req.params.id);
    if (!quest) return res.status(404).send({ message: 'Not found' });

    res.status(200).send(quest);
};

exports.addQuestion = async (req, res, next) => {
    const quest = await Question.create(req.body);

    res.status(201).send(quest);
};

exports.updateQuestion = async (req, res, next) => {
    const quest = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).send(quest);
};

exports.deleteQuestion = async (req, res, next) => {
    const quest = await Question.findByIdAndRemove(req.params.id);
    if (!quest) return res.status(404).send({ message: 'Not found' });

    res.status(200).send({ message: 'Deleted!' });
};
