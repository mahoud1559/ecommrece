module.exports = (AsyncFN) => {
  return (req, res, next) => {
    AsyncFN(req, res, next).catch((error) => {
      next(error);
    })
  }
}