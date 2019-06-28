const router = require('express').Router()

const Fringe = require('../models/Fringe')
const auth = require('../middleware/auth')

// @route   GET api/${version}/fringes
// @desc    get Fringes
// @access  Public

router.get('/', auth, async (req, res) => {
	try {
		const fringes = await Fringe.find(req.query)
		return res.send(fringes)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/fringes
// @desc    Add a Fringe
// @access  Public

router.post('/', auth, async (req, res) => {
	try {
		const fringe = new Fringe(req.body)
		const response = await fringe.save()
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/fringes/:id
// @desc    Update a Fringe
// @access  Public

router.post('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		const response = await Fringe.findByIdAndUpdate(id, { $set: req.body }, { new: true })
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   DELETE api/${version}/fringes/:id
// @desc    Delete a Fringe
// @access  Public

router.delete('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		await Fringe.findByIdAndDelete(id)
		return res.send({ success: true })
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

module.exports = router
