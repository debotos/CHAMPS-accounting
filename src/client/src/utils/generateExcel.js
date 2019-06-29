import Excel from 'exceljs/modern.browser'
import saveAs from 'file-saver'
import moment from 'moment'

export default (data, type, columns) => {
	/* Data Adjustment */
	data = data.map(x => {
		return {
			...x,
			date: moment(x.date).format('DD-MM-YYYY'),
			'payment type': x['type'].charAt(0).toUpperCase() + x['type'].slice(1),
			'economic code': x.code,
			total: (x.amount ? x.amount : 0) + (x.it ? x.it : 0) + (x.vat ? x.vat : 0),
			'others type': x.others && x.others,
			'supplies type': x.supplies && x.supplies[0],
			'equipment type': x.equipment,
			'd.a': x.da,
			't.a': x.ta
		}
	})
	/* Set Workbook Properties */

	const workbook = new Excel.Workbook()
	workbook.creator = 'CHAMPS'
	workbook.lastModifiedBy = 'Touhidur Rahman'
	workbook.created = new Date()
	workbook.modified = new Date()
	/* Workbook Views */
	workbook.views = [
		{
			x: 0,
			y: 0,
			width: 10000,
			height: 20000,
			firstSheet: 0,
			activeTab: 1,
			visibility: 'visible'
		}
	]
	/* Add a Worksheet */
	/* create new sheet with pageSetup settings for A4 - landscape */
	const worksheet = workbook.addWorksheet(type, {
		pageSetup: { paperSize: 9, orientation: 'landscape' }
	})

	/* Add Columns */
	// Using lower case for this in upper data Adjustment part i used lower case letter in key
	worksheet.columns = columns.map(x => ({ header: x, key: x.toLowerCase(), width: 20 }))

	/* Add an array of rows */
	worksheet.addRows(data)

	workbook.xlsx.writeBuffer().then(function(data) {
		var blob = new Blob([data], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		})
		saveAs(blob, `${type}.xlsx`)
	})
}
