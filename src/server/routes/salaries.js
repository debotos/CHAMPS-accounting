const router = require('express').Router()

const Salary = require('../models/Salary')
const auth = require('../middleware/auth')

// @route   GET api/${version}/salaries
// @desc    get Salaries
// @access  Public

router.get('/', auth, async (req, res) => {
	try {
		const salaries = await Salary.find(req.query)
		return res.send(salaries)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/salaries
// @desc    Add a Salary
// @access  Public

router.post('/', auth, async (req, res) => {
	try {
		const salary = new Salary(req.body)
		const response = await salary.save()
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/salaries/:id
// @desc    Update a Salary
// @access  Public

router.post('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		const response = await Salary.findByIdAndUpdate(id, { $set: req.body }, { new: true })
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   DELETE api/${version}/salaries/:id
// @desc    Delete a Salary
// @access  Public

router.delete('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		await Salary.findByIdAndDelete(id)
		return res.send({ success: true })
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

module.exports = router
