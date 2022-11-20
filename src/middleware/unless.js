// eslint-disable-next-line arrow-body-style
module.exports = (paths = [], middleware = () => {}) => {
  const callback = (req, res, next) => {
    try {
      if (
        paths.includes(
          `${req.method.toLowerCase()}${req.url.replace(/[0-9]/g, ':id')}`,
        )
      ) {
        return next();
      }
      return middleware(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
  return callback;
};
