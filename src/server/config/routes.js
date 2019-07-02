const salaries = require('../routes/salaries')
const fringes = require('../routes/fringes')
const consultant = require('../routes/consultant')
const supplies = require('../routes/supplies')
const equipment = require('../routes/equipment')
const travels = require('../routes/travels')
const others = require('../routes/others')
const budget = require('../routes/budget')
const bank = require('../routes/bank')
const users = require('../routes/users')
const common = require('../routes/common')
const error = require('../middleware/error')

const version = process.env.API_VERSION || 'v1'

module.exports = function(app) {
	app.use(`/api/${version}/salaries`, salaries)
	app.use(`/api/${version}/fringes`, fringes)
	app.use(`/api/${version}/consultant`, consultant)
	app.use(`/api/${version}/supplies`, supplies)
	app.use(`/api/${version}/equipment`, equipment)
	app.use(`/api/${version}/travels`, travels)
	app.use(`/api/${version}/others`, others)
	app.use(`/api/${version}/budget`, budget)
	app.use(`/api/${version}/bank`, bank)
	app.use(`/api/${version}/users`, users)
	app.use(`/api/${version}/common`, common)
	app.use(error)
}
