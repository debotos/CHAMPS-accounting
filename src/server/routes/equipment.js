const router = require('express').Router()

const Equipment = require('../models/Equipment')
const auth = require('../middleware/auth')

// @route   GET api/${version}/equipment
// @desc    get Equipment
// @access  Public

router.get('/', auth, async (req, res) => {
	try {
		const equipment = await Equipment.find(req.query)
		return res.send(equipment)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/equipment
// @desc    Add a Equipment
// @access  Public

router.post('/', auth, async (req, res) => {
	try {
		const supply = new Equipment(req.body)
		const response = await supply.save()
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/equipment/:id
// @desc    Update an Equipment
// @access  Public

router.post('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		const response = await Equipment.findByIdAndUpdate(id, { $set: req.body }, { new: true })
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   DELETE api/${version}/equipment/:id
// @desc    Delete an Equipment
// @access  Public

router.delete('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		await Equipment.findByIdAndDelete(id)
		return res.send({ success: true })
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

module.exports = router
