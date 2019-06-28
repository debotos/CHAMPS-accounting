const logger = require('../config/logger')

module.exports = function () {
  process.on('unhandledRejection', ex => {
    logger.error(ex)
  });
};