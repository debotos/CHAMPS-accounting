const router = require('express').Router()

const Consultant = require('../models/Consultant')
const auth = require('../middleware/auth')

// @route   GET api/${version}/consultant
// @desc    get Consultant List
// @access  Public

router.get('/', auth, async (req, res) => {
	try {
		const consultant = await Consultant.find(req.query)
		return res.send(consultant)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/consultant
// @desc    Add a Consultant
// @access  Public

router.post('/', auth, async (req, res) => {
	try {
		const consultant = new Consultant(req.body)
		const response = await consultant.save()
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/consultant/:id
// @desc    Update a Consultant
// @access  Public

router.post('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		const response = await Consultant.findByIdAndUpdate(id, { $set: req.body }, { new: true })
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   DELETE api/${version}/consultant/:id
// @desc    Delete a Consultant
// @access  Public

router.delete('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		await Consultant.findByIdAndDelete(id)
		return res.send({ success: true })
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

module.exports = router
