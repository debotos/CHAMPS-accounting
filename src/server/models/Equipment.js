const mongoose = require('mongoose')

const Schema = new mongoose.Schema(
	{
		voucher: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 100,
			index: true,
			unique: true,
			trim: true
		},
		date: {
			type: Number, // store timestamp
			required: true,
			index: true,
			trim: true
		},
		equipment: {
			type: String,
			required: true,
			minlength: 2,
			trim: true
		},
		amount: {
			type: Number,
			required: true,
			trim: true
		},
		budgetYear: {
			type: String,
			required: true,
			minlength: 11,
			maxlength: 11,
			trim: true,
			index: true
		},
		it: {
			type: Number,
			trim: true
		},
		vat: {
			type: Number,
			trim: true
		},
		code: {
			// Economic Code
			type: String,
			required: true,
			minlength: 2,
			maxlength: 100,
			trim: true
		},
		type: {
			// Cash or Cheque
			type: String,
			required: true,
			minlength: 2,
			maxlength: 100,
			trim: true
		}
	},
	{
		timestamps: true
	}
)

module.exports = Equipment = mongoose.model('Equipment', Schema)
