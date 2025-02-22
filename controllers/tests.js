const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const { sendMail } = require('../utils/sendEmail');
const Question = require('../models/question');
const Test = require('../models/test');
const User = require('../models/user');
const UserTest = require('../models/user_test');

exports.getTest = asyncHandler(async (req, res, next) => {
    const test = await Test.findById(req.params.id);
    if (!test)
        return next(
            new ErrorResponse(`Test with ID ${req.params.id} is not exist`, 404)
        );

    res.status(200).send(test);
});

exports.deleteTest = asyncHandler(async (req, res, next) => {
    // const test = await Test.findById(req.params.id);
    // if (!test)
    //     return next(
    //         new ErrorResponse(`Test with ID ${req.params.id} is not exist`, 404)
    //     );

    // await Test.findByIdAndRemove(req.params.id);

    // const userTest = await UserTest.findOne({ testId: req.params.id });
    // if (!userTest)
    //     return next(
    //         new ErrorResponse(`Test with ID ${req.params.id} is not exist`, 404)
    //     );
    await UserTest.findOneAndRemove({ testId: req.params.id });
    res.status(200).send({ message: 'Deleted!' });
});

// exports.getTests = asyncHandler(async (req, res, next) => {
//     const tests = await User.find();

//     // console.log(tests);
//     res.status(200).send({tests});
// });

exports.getUsersTest = asyncHandler(async (req, res, next) => {
    const tests = await UserTest.find().populate({
        path: 'userId',
        select: 'username',
    });

    // console.log(tests);
    res.status(200).send(tests);
});

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
            _id,
            head,
            firstChoice,
            secondChoice,
            thirdChoice,
            forthChoice,
        } = qs;
        return {
            _id,
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

    //send mail to admins after submitting the test
    const admins = await User.find({ role: 'admin' }).select('email');
    const emails = admins.map((val) => val.email);
    sendMail(emails);
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
