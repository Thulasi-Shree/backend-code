class SuccessHandler {
    constructor(message, data) {
        this.success = true;
        this.message = message;
        this.data = data;
    }

    sendResponse(res, statusCode = 200) {
        res.status(statusCode).json(this);
    }
}

module.exports = SuccessHandler;
