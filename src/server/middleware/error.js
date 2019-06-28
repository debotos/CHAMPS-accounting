const logger = require('../config/logger')

module.exports = function(err, req, res, next) {
	// error, warn, info, verbose, debug, silly
	logger.error(err.message, err)
	res.status(500).send('[Error Route Handler] Something failed.')
}
