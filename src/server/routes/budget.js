const router = require('express').Router()

const Budget = require('../models/Budget')
const auth = require('../middleware/auth')

// @route   GET api/${version}/budget
// @desc    get Budget
// @access  Public

router.get('/', auth, async (req, res) => {
	try {
		const budget = await Budget.find(req.query)
		return res.send(
			budget[0] || {
				consultant: 0,
				fringe: 0,
				other: 0,
				salary: 0,
				supply: 0,
				equipment: 0,
				travel: 0
			}
		)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/budget
// @desc    Update Budget
// @access  Public

router.post('/', auth, async (req, res) => {
	try {
		const data = await Budget.find(req.query)
		const budget = data[0]
		if (budget) {
			/* If exist then just update */
			const id = budget._id
			const response = await Budget.findByIdAndUpdate(id, { $set: req.body }, { new: true })
			return res.send(response)
		} else {
			/* Neither create */
			const newBudget = new Budget(req.body)
			const response = await newBudget.save()
			return res.send(response)
		}
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

module.exports = router
