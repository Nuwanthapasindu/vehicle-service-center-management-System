class responseBuilder {
  response;
  status = 200;
  constructor(response) {
    this.response = response;
  }
  setStatus(status) {
    this.status = status;
  }
  buildResponse(payload) {
    return this.response.status(this.status).json({
      status: this.status,
      payload,
    });
  }
  buildRedirectResponse(url) {
    const baseUrl = process.env.CLIENT_URL;
    this.response.redirect(baseUrl + url);
  }
}
module.exports = responseBuilder;
