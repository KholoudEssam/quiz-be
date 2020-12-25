const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Question = require('../models/question');
const Test = require('../models/test');
const UserTest = require('../models/user_test');

/*
 * Only students can call generate&correct test
    tests generated randomly on user click (Start Test)
    questions may repeat but every student has a different testID
 */

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

/*  req.body.testQandA => 
 * {
     testId: 456454,
     testQandA:[
         {questionId: 456457, questionHead: safdaf, userAnswer: saf},
         {questionId: 456458, questionHead: safdaf, userAnswer: saf},
         ---------------
     ]
    } 
 */
exports.correctTest = asyncHandler(async (req, res, next) => {
    const userId = req.user._id; //current logged in user -who had the test
    const { testId, testQandA } = req.body;

    const testData = await Test.findById(testId);
    if (!testData) {
        return next(
            new ErrorResponse(`Test with ID ${testId} is not exist`, 404)
        );
    }
    //questionsID and correctAnswer of the test
    const qsData = testData.questionsData;

    const testReport = await compareAnswers(qsData, testQandA, userId, testId);

    res.status(200).send(testReport);
});

const compareAnswers = async (correctAnswers, userAnswers, userID, testID) => {
    let grade = 0;

    let userTest = new UserTest();
    userTest.userId = userID;
    userTest.testId = testID;

    try {
        for (let i = 0; i < correctAnswers.length; i++) {
            for (let j = 0; j < userAnswers.length; j++) {
                if (
                    correctAnswers[i].questionId.toString() ===
                    userAnswers[j].questionId
                ) {
                    if (
                        correctAnswers[i].correctAns ===
                        userAnswers[j].userAnswer
                    ) {
                        grade++;
                    }
                    userTest.questionsData.push({
                        qsId: correctAnswers[i].questionId,
                        questionHead: userAnswers[j].questionHead,
                        userAns: userAnswers[j].userAnswer,
                        correctAns: correctAnswers[i].correctAns,
                    });
                }
            }
        }
        userTest.userGrade = grade;
        userTest = await userTest.save();
    } catch (error) {
        return next(new ErrorResponse(`error!! ${error.message}`, 500));
    }

    return userTest;
};
