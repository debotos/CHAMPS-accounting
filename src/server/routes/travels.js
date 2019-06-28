const router = require('express').Router()

const Travel = require('../models/Travel')
const auth = require('../middleware/auth')

// @route   GET api/${version}/travels
// @desc    get Travels
// @access  Public

router.get('/', auth, async (req, res) => {
	try {
		const travels = await Travel.find(req.query)
		return res.send(travels)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/travels
// @desc    Add a Travel
// @access  Public

router.post('/', auth, async (req, res) => {
	try {
		const travel = new Travel(req.body)
		const response = await travel.save()
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/travels/:id
// @desc    Update a Travel
// @access  Public

router.post('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		const response = await Travel.findByIdAndUpdate(id, { $set: req.body }, { new: true })
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   DELETE api/${version}/travels/:id
// @desc    Delete a Travel
// @access  Public

router.delete('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		await Travel.findByIdAndDelete(id)
		return res.send({ success: true })
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

module.exports = router
