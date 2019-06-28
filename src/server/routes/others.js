const router = require('express').Router()

const Other = require('../models/Other')
const auth = require('../middleware/auth')

// @route   GET api/${version}/others
// @desc    get Others
// @access  Public

router.get('/', auth, async (req, res) => {
	try {
		const others = await Other.find(req.query)
		return res.send(others)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/others
// @desc    Add a Other
// @access  Public

router.post('/', auth, async (req, res) => {
	try {
		const other = new Other(req.body)
		const response = await other.save()
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   POST api/${version}/others/:id
// @desc    Update a Other
// @access  Public

router.post('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		const response = await Other.findByIdAndUpdate(id, { $set: req.body }, { new: true })
		return res.send(response)
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

// @route   DELETE api/${version}/others/:id
// @desc    Delete a Other
// @access  Public

router.delete('/:id', auth, async (req, res) => {
	try {
		const id = req.params.id
		await Other.findByIdAndDelete(id)
		return res.send({ success: true })
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

module.exports = router
