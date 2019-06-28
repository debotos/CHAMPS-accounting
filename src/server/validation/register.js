const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
	let errors = {}

	data.full_name = !isEmpty(data.full_name) ? data.full_name : ''
	data.email = !isEmpty(data.email) ? data.email : ''
	data.password = !isEmpty(data.password) ? data.password.toString() : ''
	data.password2 = !isEmpty(data.password2) ? data.password2.toString() : ''

	// full_name
	if (!Validator.isLength(data.full_name, { min: 3, max: 200 })) {
		errors.full_name = 'Full Name at least have to be 3 character long'
	}

	if (Validator.isEmpty(data.full_name)) {
		errors.full_name = 'Full Name field is required'
	}

	// email
	if (!Validator.isEmail(data.email)) {
		errors.email = 'Email is invalid'
	}

	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required'
	}

	// password
	if (!Validator.isLength(data.password, { min: 8 })) {
		errors.password = 'Password must be at least 8 characters'
	}

	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required'
	}

	if (Validator.isEmpty(data.password2)) {
		errors.password2 = 'Confirm Password field is required'
	}

	if (!Validator.equals(data.password, data.password2)) {
		errors.password2 = "Passwords don't match"
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}
