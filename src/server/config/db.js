const logger = require('../config/logger')
const mongoURI = require('./credential/keys').mongoURI

module.exports = function(mongoose) {
	mongoose
		.connect(mongoURI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
		})
		.then(() => logger.info(` ✔ Connected to MongoDB 🛢️ `))
}
