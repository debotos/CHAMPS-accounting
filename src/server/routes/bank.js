const router = require('express').Router()

const Bank = require('../models/Bank')
const auth = require('../middleware/auth')

// @route   GET api/${version}/bank
// @desc    get Bank
// @access  Public

router.get('/', auth, async (req, res) => {
	try {
		const bank = await Bank.find(req.query)
		return res.send(
			bank[0] || { consultant: 0, fringe: 0, other: 0, salary: 0, supply: 0, travel: 0 }
		)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/bank
// @desc    Update Bank
// @access  Public

router.post('/', auth, async (req, res) => {
	try {
		const data = await Bank.find(req.query)
		const bank = data[0]
		if (bank) {
			/* If exist then just update */
			const id = bank._id
			const response = await Bank.findByIdAndUpdate(id, { $set: req.body }, { new: true })
			return res.send(response)
		} else {
			/* Neither create */
			const newBank = new Bank(req.body)
			const response = await newBank.save()
			return res.send(response)
		}
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

module.exports = router
