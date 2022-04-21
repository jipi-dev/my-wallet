const httpStatus = require('http-status');
const logger = require('../logger');

const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  logger.log('error', `Some error, responding:  ${JSON.stringify(response)}`);
  res.status(err.status);
  res.json(response);
};
exports.handler = handler;

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = {
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  };
  return handler(err, req, res);
};
