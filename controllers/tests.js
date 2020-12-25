const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Question = require('../models/question');
const Test = require('../models/test');

exports.generateTest = asyncHandler(async (req, res, next) => {
    const qsNumberInDB = await Question.find().countDocuments();
    if (+process.env.QUESTIONS_PER_TEST > qsNumberInDB) {
        return next(
            new ErrorResponse(
                'Number of questions per test is greater than the questions number in database',
                400
            )
        );
    }
    const sampleQs = await Question.aggregate().sample(
        +process.env.QUESTIONS_PER_TEST
    );

    //to get only questions id & correct answer to save in db
    const qsData = sampleQs.map((qs) => {
        return {
            questionId: qs._id,
            correctAns: qs.correctAnswer,
        };
    });
    // to get all questions info to send to api consumer - are not saved in db
    const qsHeadAndAnswers = sampleQs.map((qs) => {
        const {
            head,
            firstChoice,
            secondChoice,
            thirdChoice,
            forthChoice,
        } = qs;
        return {
            head,
            firstChoice,
            secondChoice,
            thirdChoice,
            forthChoice,
        };
    });

    const test = await Test.create({
        questionsData: qsData,
    });

    res.status(200).send({ testId: test._id, qsHeadAndAnswers });
});

/*  req.body =>
 * {
     testId: 456454,
     testQandA:[
         {questionId: 456457, userAnswer: saf},
         {questionId: 456458, userAnswer: saf},
         ---------------
     ]
    } 
 */
exports.correctTest = asyncHandler(async (req, res, next) => {
    //const userId = req.user._id; //current logged in user -who had the test
    const { testId } = req.body;
    const { testQandA } = req.body;

    const testData = await Test.findById(testId);
    if (!testData) {
        return next(
            new ErrorResponse(`Test with ID ${testId} is not exist`, 404)
        );
    }
    //questionsID and correctAnswer of the test
    const qsData = testData.questionsData;

    let userGrade = compareAnswers(qsData, testQandA);

    console.log(userGrade);

    // console.log(testQandA);
    // console.log(qsData);
    // console.log(typeof qsData[0].questionId);
    // console.log(typeof testQandA[0].questionId);

    res.status(200).send({ message: 'Ok' });
});

const compareAnswers = (correctAnswers, userAnswers) => {
    let grade = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
        for (let j = 0; j < userAnswers.length; j++) {
            if (
                correctAnswers[i].questionId.toString() ===
                userAnswers[j].questionId
            ) {
                if (
                    correctAnswers[i].correctAns === userAnswers[j].userAnswer
                ) {
                    grade++;
                }
            }
        }
    }
    return grade;
};
