const logger = require('../utils/logError')
class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor)
        logger.error(`Error: ${message}`);
    }
}

module.exports = ErrorHandler;