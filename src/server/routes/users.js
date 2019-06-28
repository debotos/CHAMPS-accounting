const bcrypt = require('bcryptjs')
const _ = require('lodash')
const router = require('express').Router()

const User = require('../models/User')
const auth = require('../middleware/auth')
const validateLoginInput = require('../validation/login')
const validateSignUpInput = require('../validation/register')
const {
	validateBasicProfileUpdateInupt,
	validatePasswordUpdateInput
} = require('../validation/updateProfile')

// @route   GET api/${version}/users/me
// @desc    Return current user
// @access  Private
// [postman]set Header key: Authentication, value: token
router.get('/me', auth, async (req, res) => {
	const user = await User.findById(req.user.id).select('-password')
	if (user) {
		return res.send(user)
	} else {
		return res.status(400).send('Not logged in!')
	}
})

// @route   DELETE api/${version}/users/me
// @desc    Delete current user account [Whole Data]
// @access  Private
router.delete('/me', auth, (req, res) => {
	User.findOneAndRemove({ _id: req.user.id }).then(() => {
		res.json({ success: true })
	})
})

// @route   POST api/${version}/users/remove
// @desc    Remove an User account [Whole Data]
// @access  Private
router.post('/remove', auth, async (req, res) => {
	// Check user is an admin
	if (!req.user.isAdmin) {
		return res.status(400).json({ error: "You don't have Admin privilege" })
	}

	const userRemoved = await User.findOneAndRemove({
		email: req.body.email
	}).select('-password')

	return res.json({ success: true, userRemoved })
})

// @route   GET api/${version}/users/all
// @desc    Get all profiles
// @access  Private
router.get('/all', auth, (req, res) => {
	const errors = {}

	User.find()
		.select('-password')
		.then(profiles => {
			if (!profiles) {
				errors.noprofile = 'There are no profiles'
				return res.status(404).json(errors)
			}

			res.json(profiles)
		})
		.catch(err => res.status(404).json({ profiles: 'There are no profiles' }))
})

// @route   POST api/${version}/users/register
// @desc    Register user
// @access  Private
router.post('/register', auth, async (req, res) => {
	const { errors, isValid } = validateSignUpInput(req.body)
	// Check Validation
	if (!isValid) return res.status(400).json(errors)

	let emailExist = await User.findOne({ email: req.body.email })
	if (emailExist) return res.status(400).send({ email: 'Email already exists!' })

	let user = new User(_.pick(req.body, ['full_name', 'email', 'password', 'isAdmin']))

	const salt = await bcrypt.genSalt(10)
	user.password = await bcrypt.hash(user.password, salt)
	await user.save()
	const userData = await User.findOne({ email: req.body.email }).select('-password')
	res.json({
		success: true,
		successMsg: '👨‍ Successfully registered a new admin account ✔ ',
		userData
	})
})

// @route   GET api/${version}/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', async (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body)
	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors)
	}

	let user = await User.findOne({ email: req.body.email })
	// Check for user
	if (!user) {
		errors.email = 'User not found!'
		return res.status(404).json(errors)
	}

	const validPassword = await bcrypt.compare(req.body.password, user.password)
	if (!validPassword) {
		errors.password = 'Password incorrect!'
		return res.status(404).json(errors)
	}

	const token = user.generateAuthToken()
	const userData = await User.findOne({ email: req.body.email }).select('-password')
	res.json({
		success: true,
		token: token,
		user: userData
	})
})

// @route   POST api/${version}/users/me/edit/basic
// @desc    Update basic user info
// @access  Private
router.post('/me/edit/basic', auth, async (req, res) => {
	const { errors, isValid } = validateBasicProfileUpdateInupt(req.body)
	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	// Check for user
	let user = await User.findOne({ email: req.body.email })

	// User can't change email but ['full_name']
	let userUpdate = _.pick(req.body, ['full_name'])

	const profileUpdated = await User.findOneAndUpdate(
		{ email: req.user.email },
		{ $set: userUpdate },
		{ new: true }
	)

	return res.json(profileUpdated)
})

// @route   POST api/${version}/users/me/edit/password
// @desc    Update user password
// @access  Private
router.post('/me/edit/password', auth, async (req, res) => {
	const { errors, isValid } = validatePasswordUpdateInput(req.body)
	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	// Check for user's password
	let user = await User.findOne({ email: req.user.email })
	if (!user) {
		return res.status(404).json({ error: 'User not found!' })
	}
	const validPassword = await bcrypt.compare(req.body.cpassword, user.password)

	if (!validPassword) {
		errors.cpassword = 'Current Password incorrect!'
		return res.status(404).json(errors)
	} else {
		let userUpdate = _.pick(req.body, ['password'])
		const salt = await bcrypt.genSalt(10)
		userUpdate.password = await bcrypt.hash(userUpdate.password, salt)

		const profileUpdated = await User.findOneAndUpdate(
			{ email: req.user.email },
			{ $set: userUpdate },
			{ new: true }
		).select('-password')

		return res.json({ success: true, profileUpdated })
	}
})

module.exports = router
