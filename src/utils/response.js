// eslint-disable-next-line arrow-body-style
const createSuccessResponse = (res, message, data = null, code = 200) => {
  return res.status(code).json({ status: 'success', message, data });
};

// eslint-disable-next-line arrow-body-style
const createErrorResponse = (res, message, data = null, code = 400) => {
  return res.status(code).json({ status: 'fail', message, data });
};

module.exports = { createSuccessResponse, createErrorResponse };
