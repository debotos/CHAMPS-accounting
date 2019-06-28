const router = require('express').Router()

const Supply = require('../models/Supply')
const auth = require('../middleware/auth')

// @route   GET api/${version}/supplies
// @desc    get Supplies
// @access  Public

router.get('/', auth, async (req, res) => {
	try {
		const supplies = await Supply.find(req.query)
		return res.send(supplies)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/supplies
// @desc    Add a Supply
// @access  Public

router.post('/', auth, async (req, res) => {
	try {
		const supply = new Supply(req.body)
		const response = await supply.save()
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/supplies/:id
// @desc    Update a Supply
// @access  Public

router.post('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		const response = await Supply.findByIdAndUpdate(id, { $set: req.body }, { new: true })
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   DELETE api/${version}/supplies/:id
// @desc    Delete a Supply
// @access  Public

router.delete('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		await Supply.findByIdAndDelete(id)
		return res.send({ success: true })
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

module.exports = router
