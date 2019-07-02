const router = require('express').Router()

const auth = require('../middleware/auth')
const Bank = require('../models/Bank')
const Budget = require('../models/Budget')

const Consultant = require('../models/Consultant')
const Equipment = require('../models/Equipment')
const Fringe = require('../models/Fringe')
const Other = require('../models/Other')
const Salary = require('../models/Salary')
const Supply = require('../models/Supply')
const Travel = require('../models/Travel')

// @route   GET api/${version}/common
// @desc    get Summary
// @access  Private

router.get('/summary', auth, async (req, res) => {
	try {
		const defaultData = {
			consultant: 0,
			fringe: 0,
			other: 0,
			salary: 0,
			supply: 0,
			equipment: 0,
			travel: 0
		}

		const bankQuery = await Bank.find(req.query)
		let bankData = bankQuery[0] || defaultData
		let bankTotal = 0
		Object.keys(defaultData).forEach(x => (bankTotal = bankTotal + (bankData[x] ? bankData[x] : 0)))

		const budgetQuery = await Budget.find(req.query)
		let budgetData = budgetQuery[0] || defaultData
		let budgetTotal = 0
		Object.keys(defaultData).forEach(
			x => (budgetTotal = budgetTotal + (budgetData[x] ? budgetData[x] : 0))
		)

		let consultantTotal = 0
		let consultant = await Consultant.find(req.query)
		consultant = consultant.forEach(
			x =>
				(consultantTotal =
					consultantTotal + ((x.amount ? x.amount : 0) + (x.it ? x.it : 0) + (x.vat ? x.vat : 0)))
		)

		let equipmentTotal = 0
		let equipment = await Equipment.find(req.query)
		equipment = equipment.forEach(
			x =>
				(equipmentTotal =
					equipmentTotal + ((x.amount ? x.amount : 0) + (x.it ? x.it : 0) + (x.vat ? x.vat : 0)))
		)

		let fringesTotal = 0
		let fringes = await Fringe.find(req.query)
		fringes = fringes.forEach(
			x =>
				(fringesTotal =
					fringesTotal + ((x.amount ? x.amount : 0) + (x.it ? x.it : 0) + (x.vat ? x.vat : 0)))
		)

		let othersTotal = 0
		let others = await Other.find(req.query)
		others = others.forEach(
			x =>
				(othersTotal =
					othersTotal + ((x.amount ? x.amount : 0) + (x.it ? x.it : 0) + (x.vat ? x.vat : 0)))
		)

		let salariesTotal = 0
		let salaries = await Salary.find(req.query)
		salaries = salaries.forEach(
			x =>
				(salariesTotal =
					salariesTotal + ((x.amount ? x.amount : 0) + (x.it ? x.it : 0) + (x.vat ? x.vat : 0)))
		)

		let suppliesTotal = 0
		let supplies = await Supply.find(req.query)
		supplies = supplies.forEach(
			x =>
				(suppliesTotal =
					suppliesTotal + ((x.amount ? x.amount : 0) + (x.it ? x.it : 0) + (x.vat ? x.vat : 0)))
		)

		let travelsTotal = 0
		let travels = await Travel.find(req.query)
		travels = travels.forEach(
			x =>
				(travelsTotal =
					travelsTotal + ((x.amount ? x.amount : 0) + (x.it ? x.it : 0) + (x.vat ? x.vat : 0)))
		)

		const costTotal =
			consultantTotal +
			equipmentTotal +
			fringesTotal +
			othersTotal +
			salariesTotal +
			suppliesTotal +
			travelsTotal

		return res.send({
			originalBudget: budgetTotal,
			bankIssued: bankTotal,
			costTotal,
			balanceOriginal: budgetTotal - costTotal,
			balanceBank: bankTotal - costTotal
		})
	} catch (error) {
		console.log(error)
		return res.send({ error: true, msg: error.message })
	}
})

module.exports = router
