class ERROR extends Error {
  constructor() {
    super();
  }

  create(message, statusCode, stetusText) {
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = stetusText;
    return this;
  }
}

module.exports = new ERROR();