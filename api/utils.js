function buildError (message) {
  return {
    error: true,
    message,
  }
}

module.exports = {
  buildError,
}
