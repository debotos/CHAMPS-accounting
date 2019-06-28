const express = require('express')
require('express-async-errors')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const helmet = require('helmet')
const compression = require('compression')
const path = require('path')
const mongoose = require('mongoose')

// logging production environment variable
if (process.env.NODE_ENV === 'production') {
	console.log('Environment Variables: \n', process.env)
}
// middlewares
app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(compression())
app.use(helmet())

require('./config/validation')()
require('./config/db')(mongoose)
require('./config/routes')(app)

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static(path.join(__dirname, '../client/build')))
	app.get('*', (req, res) => {
		console.log('Serving Client...')
		return res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'))
	})
}
module.exports = app
