const winston = require('winston')

module.exports = winston.createLogger({
	transports: [
		new winston.transports.Console({
			colorize: true,
			handleExceptions: true,
			prettyPrint: true
		}),
		new winston.transports.File({
			filename: 'logs/error-logs-file.log',
			handleExceptions: true,
			level: 'error'
		}),
		new winston.transports.File({
			filename: 'logs/info-logs-file.log',
			level: 'info'
		}),
		new winston.transports.File({
			filename: 'logs/warn-logs-file.log',
			level: 'warn'
		})
	]
})
