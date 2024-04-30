class ExpressError {
  constructor(statasCode, message) {
    this.statasCode = statasCode;
    this.message = message;
  }
}

module.exports = ExpressError;
