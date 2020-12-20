// err => instance of ErrorResponse class
const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        error: err.message || 'Server Error',
    });
};

module.exports = errorHandler;
