const logger = require('../utils/logger');
const Boom = require('@hapi/boom');

const errorHandler = (error, h) => {
  if (Boom.isBoom(error)) {
    return h.response(error.output.payload).code(error.output.statusCode);
  }
  logger.error('Unhandled error:', error);
  return h.response({ statusCode: 500, error: 'Internal Server Error', message: 'An unexpected error occurred' }).code(500);
};

module.exports = errorHandler;