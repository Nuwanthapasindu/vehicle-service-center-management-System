const responseBuild = require("../util/responseBuilder");

module.exports = (error, request, response, next) => {
  const responseBuilder = new responseBuild(response);
  responseBuilder.setStatus(error.statusCode || 500);
  return responseBuilder.buildResponse({
    statusCode: error.statusCode,
    status: error.status,
    message: error.message,
  });
};
