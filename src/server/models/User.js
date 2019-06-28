const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const jwtPrivateKey = require('../config/credential/keys').jwtPrivateKey

const userSchema = new mongoose.Schema(
	{
		full_name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 200
		},
		email: {
			type: String,
			required: true,
			unique: true,
			index: true
		},
		password: {
			type: String,
			required: true,
			minlength: 8
		},
		isAdmin: {
			type: Boolean,
			default: false
		} // Manage User Permission
	},
	{
		timestamps: true
	}
)

userSchema.methods.generateAuthToken = function() {
	const token = jwt.sign(
		{
			id: this._id,
			full_name: this.full_name,
			email: this.email,
			isAdmin: this.isAdmin
		},
		jwtPrivateKey,
		{ expiresIn: '365d' }
	)
	return token
}

module.exports = User = mongoose.model('User', userSchema)
