const Validator = require('validator')
const isEmpty = require('./is-empty')

function validateBasicProfileUpdateInupt(data) {
	let errors = {}
	data.full_name = !isEmpty(data.full_name) ? data.full_name : ''

	// full_name
	if (!Validator.isLength(data.full_name, { min: 3, max: 200 })) {
		errors.full_name = 'Full Name at least have to be 3 character long!'
	}

	if (Validator.isEmpty(data.full_name)) {
		errors.full_name = 'Full Name field is required!'
	}
	return {
		errors,
		isValid: isEmpty(errors)
	}
}

function validatePasswordUpdateInput(data) {
	let errors = {}

	data.cpassword = !isEmpty(data.cpassword) ? data.cpassword.toString() : ''
	data.password = !isEmpty(data.password) ? data.password.toString() : ''
	data.password2 = !isEmpty(data.password2) ? data.password2.toString() : ''

	// password
	if (!Validator.isEmpty(data.cpassword)) {
		if (!Validator.isLength(data.password, { min: 8 })) {
			errors.password = 'Password must be at least 8 characters!'
		}

		if (Validator.isEmpty(data.password)) {
			errors.password = 'Password field is required!'
		}

		if (Validator.isEmpty(data.password2)) {
			errors.password2 = 'Confirm Password field is required!'
		}

		if (!Validator.equals(data.password, data.password2)) {
			errors.password2 = 'Passwords must match!'
		}
	} else {
		errors.cpassword = 'Current password Required!'
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}

module.exports = {
	validateBasicProfileUpdateInupt,
	validatePasswordUpdateInput
}
