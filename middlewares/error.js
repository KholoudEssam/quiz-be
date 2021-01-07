const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {};
    error.message = err.message;
    error.statusCode = err.statusCode;

    //mongoose errors .. like invalid _id format
    if (err.name === 'CastError') {
        error = new ErrorResponse(`Invalid ID ${err.value} format`, 400);
    }
    if (err.name === 'ValidationError') {
        //returns an array of ''err.errors'' enumerable properties
        // extract only message
        const msg = Object.values(err.errors).map((val) => val.message);
        // console.log(Object.values(err.errors));
        console.log('error');
        error = new ErrorResponse(msg, 400);
    }
    //duplication error
    if (err.code === 11000) {
        error = new ErrorResponse(`Duplicate fields entered`, 400);
    }

    res.status(error.statusCode || 500).send({
        error: error.message || 'Server Error',
    });
};

module.exports = errorHandler;
