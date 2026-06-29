const sendResponse = (res, {
    success = true,
    message = "",
    data = null,
    pagination = null,
    status = 200
}) => {
    return res.status(status).json({
        success,
        message,
        data,
        pagination
    });
};

module.exports = {
   sendResponse
}