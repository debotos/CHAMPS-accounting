import React, { Component } from 'react'
import {
	Form,
	Input,
	Button,
	DatePicker,
	InputNumber,
	Select,
	Table,
	Popconfirm,
	Spin,
	message,
	Icon
} from 'antd'
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'
import Highlighter from 'react-highlight-words'

import checkVoucher from '../../../utils/checkVoucher'

const Option = Select.Option
const options = [
	<Option key={1} value="Swab Stick">
		Swab stick
	</Option>,
	<Option key={2} value="Lint free clean wipes">
		Lint free clean wipes
	</Option>,
	<Option key={3} value="Absolute alcohol">
		Absolute alcohol
	</Option>,
	<Option key={4} value="Aluminium foil">
		Aluminium foil
	</Option>,
	<Option key={5} value="Paraffin">
		Paraffin
	</Option>,
	<Option key={6} value="Powder free golves">
		Powder free golves
	</Option>,
	<Option key={7} value="Sample bou">
		Sample bou
	</Option>,
	<Option key={8} value="Aerosol barrier">
		Aerosol barrier
	</Option>,
	<Option key={9} value="Refil dry shipper with liquid ritrogen">
		Refil dry shipper with liquid ritrogen
	</Option>,
	<Option key={10} value="Sterile eppendorf tube">
		Sterile eppendorf tube
	</Option>,
	<Option key={11} value="24 well cooler rack">
		24 well cooler rack
	</Option>,
	<Option key={12} value="96 well cooler rack">
		96 well cooler rack
	</Option>,
	<Option key={13} value="VTm">
		VTm
	</Option>
]

const SelectTypeOptions = [
	<Option key="1" value={`cash`}>
		Cash
	</Option>,
	<Option key="2" value={`cheque`}>
		Cheque
	</Option>
]

function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field])
}

export class Supplies extends Component {
	componentDidMount() {
		this.getSupplies(this.props.budgetYear)
		// To disabled submit button at the beginning.
		this.props.form.validateFields()
	}

	getSupplies = async budgetYear => {
		try {
			this.setState({ loading: true })
			const response = await axios.get(`/api/v1/supplies?budgetYear=${budgetYear}`)
			const data = response.data.map(x => ({ ...x, key: x._id })).reverse()
			this.setState({ data }, () => this.setState({ loading: false }))
		} catch (error) {
			console.log(error)
			message.error('Failed to load the supplies data!')
		}
	}

	state = { working: false, loading: true, data: [] }

	handleSubmit = e => {
		e.preventDefault()
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				this.setState({ working: true })
				console.log('Received values of Supplies form: ', values)
				const voucherExist = await checkVoucher('supplies', values.voucher)
				if (voucherExist) {
					this.setState({ working: false })
					return message.error('Voucher Code Already Exists!')
				}
				const data = {
					voucher: values.voucher,
					date: values.date.valueOf(),
					supplies: values.supplies,
					amount: values.amount,
					budgetYear: this.props.budgetYear,
					it: values.it,
					vat: values.vat,
					type: values.type,
					code: values.code || ''
				}
				console.log('Supplies form data formated: ', data)
				axios
					.post('/api/v1/supplies', data)
					.then(response => {
						const data = response.data
						console.log('Supplies form submit response: ', data)
						/* Instant UI update */
						this.addData(data)
						this.setState({ working: false })
						message.success('Added Successfully!')
						// Clear the form
						this.props.form.resetFields()
						// To disabled submit button
						this.props.form.validateFields()
					})
					.catch(error => {
						console.log(error.message)
						message.error('Failed to add!')
						this.setState({ working: false })
					})
			}
		})
	}

	updateData = (id, data) => {
		const update = this.state.data.map(x => {
			if (x.key === id) {
				return { ...x, ...data }
			} else {
				return x
			}
		})
		this.setState({ data: update })
	}

	addData = data => {
		const current = this.state.data
		current.unshift({ ...data, key: data._id })
		this.setState({ data: current })
	}
	deleteData = id => {
		const update = this.state.data.filter(x => x.key !== id)
		this.setState({ data: update })
	}

	render() {
		const { working, loading, data } = this.state
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

		const voucherError = isFieldTouched('voucher') && getFieldError('voucher')
		const amountError = isFieldTouched('amount') && getFieldError('amount')
		const dateError = isFieldTouched('date') && getFieldError('date')
		const suppliesError = isFieldTouched('supplies') && getFieldError('supplies')
		const typeError = isFieldTouched('type') && getFieldError('type')
		const codeError = isFieldTouched('code') && getFieldError('code')

		return (
			<>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<Form.Item validateStatus={voucherError ? 'error' : ''} help={voucherError || ''}>
						{getFieldDecorator('voucher', {
							rules: [{ required: true, message: 'Please provide Voucher No.!' }]
						})(<Input placeholder="Voucher No." />)}
					</Form.Item>

					<Form.Item validateStatus={suppliesError ? 'error' : ''} help={suppliesError || ''}>
						{getFieldDecorator('supplies', {
							rules: [
								{ required: true, message: 'Please provide Supplies Type!' },
								{
									validator: (rule, value, callback) => {
										if (value) {
											if (value.length > 1) {
												callback('Select Only One Type!')
											} else if (value.length <= 1) {
												callback()
											}
										}
										callback('Select Type!')
									}
								}
							]
						})(
							<Select
								mode="tags"
								style={{ minWidth: 300 }}
								placeholder="Supplies Type"
								showSearch
								optionFilterProp="children"
								filterOption={(input, option) =>
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}
							>
								{options}
							</Select>
						)}
					</Form.Item>

					<Form.Item validateStatus={dateError ? 'error' : ''} help={dateError || ''}>
						{getFieldDecorator('date', {
							rules: [{ required: true, message: 'Please provide Date!' }]
						})(<DatePicker placeholder="Select Date" />)}
					</Form.Item>

					<Form.Item
						label="Amount"
						validateStatus={amountError ? 'error' : ''}
						help={amountError || ''}
					>
						{getFieldDecorator('amount', {
							rules: [{ required: true, message: 'Provide Amount!' }]
						})(
							<InputNumber
								formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/৳\s?|(,*)/g, '')}
								min={1}
							/>
						)}
					</Form.Item>
					<Form.Item label="IT">
						{getFieldDecorator('it', {})(
							<InputNumber
								formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/৳\s?|(,*)/g, '')}
								min={0}
							/>
						)}
					</Form.Item>

					<Form.Item label="VAT">
						{getFieldDecorator('vat', {})(
							<InputNumber
								formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/৳\s?|(,*)/g, '')}
								min={0}
								placeholder="VAT"
							/>
						)}
					</Form.Item>

					<Form.Item validateStatus={typeError ? 'error' : ''} help={typeError || ''}>
						{getFieldDecorator('type', {
							initialValue: 'cash',
							rules: [{ required: true, message: 'Please provide type!' }]
						})(<Select style={{ minWidth: 100 }}>{SelectTypeOptions}</Select>)}
					</Form.Item>

					<Form.Item validateStatus={codeError ? 'error' : ''} help={codeError || ''}>
						{getFieldDecorator('code', {})(<Input placeholder="Economic code" />)}
					</Form.Item>

					<Form.Item>
						<Button
							loading={working}
							type="primary"
							htmlType="submit"
							disabled={hasErrors(getFieldsError())}
						>
							Add
						</Button>
					</Form.Item>
				</Form>
				<br />
				{!loading ? (
					<EditableFormTable
						data={data}
						updateData={this.updateData}
						deleteData={this.deleteData}
					/>
				) : (
					<Spin size="large" />
				)}
			</>
		)
	}
}

const SuppliesForm = Form.create({ name: 'supplies_form' })(Supplies)

export default SuppliesForm

/*
	*******************************
	Below code for Generate Table
	*******************************
*/

const EditableContext = React.createContext()

class EditableCell extends React.Component {
	getInput = (field, getFieldDecorator, title, record) => {
		switch (field) {
			case 'amount':
				return getFieldDecorator(field, {
					rules: [
						{
							required: true,
							message: `Please Input ${title}!`
						}
					],
					initialValue: this.getInputValue(record, field)
				})(
					<InputNumber
						formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={value => value.replace(/৳\s?|(,*)/g, '')}
						min={1}
					/>
				)
			case 'date':
				return getFieldDecorator(field, {
					rules: [
						{
							required: true,
							message: `Please Input ${title}!`
						}
					],
					initialValue: this.getInputValue(record, field)
				})(<DatePicker placeholder="Select Date" />)
			case 'supplies':
				return getFieldDecorator('supplies', {
					initialValue: record[field],
					rules: [
						{ required: true, message: 'Please provide Supplies Type!' },
						{
							validator: (rule, value, callback) => {
								if (value) {
									if (value.length > 1) {
										callback('Select Only One Type!')
									} else if (value.length <= 1) {
										callback()
									}
								}
								return
							}
						}
					]
				})(
					<Select
						mode="tags"
						style={{ minWidth: 200 }}
						placeholder="Supplies Type"
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
					>
						{options}
					</Select>
				)

			case 'it':
				return getFieldDecorator('it', { initialValue: this.getInputValue(record, field) })(
					<InputNumber
						formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={value => value.replace(/৳\s?|(,*)/g, '')}
						min={0}
					/>
				)

			case 'vat':
				return getFieldDecorator('vat', { initialValue: this.getInputValue(record, field) })(
					<InputNumber
						formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={value => value.replace(/৳\s?|(,*)/g, '')}
						min={0}
						placeholder="VAT"
					/>
				)

			case 'type':
				return getFieldDecorator('type', {
					initialValue: this.getInputValue(record, field),
					rules: [{ required: true, message: 'Please provide type!' }]
				})(<Select style={{ minWidth: 100 }}>{SelectTypeOptions}</Select>)

			case 'code':
				return getFieldDecorator('code', { initialValue: this.getInputValue(record, field) })(
					<Input placeholder="Economic code" />
				)

			default:
				return getFieldDecorator(field, {
					rules: [
						{
							required: true,
							message: `Please Input ${title}!`
						}
					],
					initialValue: this.getInputValue(record, field)
				})(<Input />)
		}
	}

	getInputValue = (record, field) => {
		switch (field) {
			case 'date':
				return moment(record[field])

			default:
				return record[field]
		}
	}

	renderDataView = (children, record, field) => {
		switch (field) {
			case 'date':
				return `${moment(record[field]).format('ddd, MMM Do YY')} (${moment(record[field]).format(
					'DD-MM-YYYY'
				)})`
			case 'amount':
			case 'it':
			case 'vat':
				return `${numeral(record[field]).format('0,0.00')} ৳`
			case 'type':
				return <span style={{ textTransform: 'capitalize' }}>{record[field]}</span>
			default:
				return children
		}
	}

	renderCell = ({ getFieldDecorator }) => {
		const { editing, dataIndex, title, record, index, children, ...restProps } = this.props
		return (
			<td {...restProps}>
				{editing ? (
					<Form.Item style={{ margin: 0 }}>
						{this.getInput(dataIndex, getFieldDecorator, title, record)}
					</Form.Item>
				) : (
					this.renderDataView(children, record, dataIndex)
				)}
			</td>
		)
	}

	render() {
		return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
	}
}

class EditableTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = { editingKey: '' }
		this.columns = [
			{
				title: 'Voucher',
				dataIndex: 'voucher',
				width: '10%',
				editable: true,
				...this.getColumnSearchProps('voucher')
			},
			{
				title: 'Supplies Type',
				dataIndex: 'supplies',
				width: '15%',
				editable: true,
				...this.getColumnSearchProps('supplies')
			},
			{
				title: 'Date',
				dataIndex: 'date',
				width: '15%',
				editable: true,
				sorter: (a, b) => a.date - b.date
			},
			{
				title: 'Total Cost',
				dataIndex: 'amount',
				width: '10%',
				editable: true,
				// defaultSortOrder: 'descend',
				sorter: (a, b) => a.amount - b.amount
			},
			{
				title: 'IT',
				dataIndex: 'it',
				width: '10%',
				editable: true,
				// defaultSortOrder: 'descend',
				sorter: (a, b) => a.it - b.it
			},
			{
				title: 'VAT',
				dataIndex: 'vat',
				width: '10%',
				editable: true,
				// defaultSortOrder: 'descend',
				sorter: (a, b) => a.vat - b.vat
			},
			{
				title: 'Type',
				dataIndex: 'type',
				width: '10%',
				editable: true,
				// 9
				key: 'type',
				filters: [{ text: 'Cash', value: 'cash' }, { text: 'Cheque', value: 'cheque' }],
				onFilter: (value, record) => record.type.includes(value),
				sorter: (a, b) => a.type.length - b.type.length
			},
			{
				title: 'Code',
				dataIndex: 'code',
				width: '10%',
				editable: true,
				...this.getColumnSearchProps('code')
			},
			{
				title: 'operation',
				dataIndex: 'operation',
				render: (text, record) => {
					const { editingKey } = this.state
					const editable = this.isEditing(record)
					return editable ? (
						<span>
							<EditableContext.Consumer>
								{form => (
									// eslint-disable-next-line
									<a
										// eslint-disable-next-line
										href="javascript:;"
										onClick={() => this.save(form, record.key)}
										style={{ marginRight: 8 }}
									>
										Save
									</a>
								)}
							</EditableContext.Consumer>
							<Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
								{/* eslint-disable-next-line */}
								<a>Cancel</a>
							</Popconfirm>
						</span>
					) : (
						<span>
							{/* eslint-disable-next-line */}
							<a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
								Edit
							</a>
							<Popconfirm
								title="Sure to delete?"
								icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
								onConfirm={() => this.delete(record.key)}
							>
								{/* eslint-disable-next-line */}
								<a href="javascript:;" style={{ marginLeft: 8, color: '#e26a6a' }}>
									Delete
								</a>
							</Popconfirm>
						</span>
					)
				}
			}
		]
	}

	isEditing = record => record.key === this.state.editingKey

	cancel = () => {
		this.setState({ editingKey: '' })
	}

	delete(key) {
		/* Instant UI update */
		this.props.deleteData(key)
		axios
			.delete(`/api/v1/supplies/${key}`)
			.then(response => {
				console.log('Supply delete response ', response.data)
				message.success('Successfully Deleted!')
			})
			.catch(error => {
				console.log(error.message)
				message.error('Failed to delete!')
			})
	}

	save(form, key) {
		form.validateFields((err, row) => {
			if (!err) {
				console.log('Received values of Supplies Update form: ', row)
				const data = {
					voucher: row.voucher,
					date: row.date.valueOf(),
					supplies: row.supplies,
					amount: row.amount,
					it: row.it,
					vat: row.vat,
					type: row.type,
					code: row.code || ''
				}
				console.log('Supplies updated form data formated: ', data)
				/* Instant UI update */
				this.props.updateData(key, data)
				axios
					.post(`/api/v1/supplies/${key}`, data)
					.then(response => {
						const data = response.data
						console.log('Supplies form update response: ', data)
						// To disabled submit button
						this.props.form.validateFields()
						this.cancel(key)
						message.success('Successfully Updated!')
					})
					.catch(error => {
						console.log(error.message)
						message.error('Failed to update!')
					})
			}
		})
	}

	edit(key) {
		this.setState({ editingKey: key })
	}

	state = {
		searchText: ''
	}

	handleSearch = (selectedKeys, confirm) => {
		confirm()
		this.setState({ searchText: selectedKeys[0] })
	}

	handleReset = clearFilters => {
		clearFilters()
		this.setState({ searchText: '' })
	}

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => this.handleSearch(selectedKeys, confirm)}
					icon="search"
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					Search
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Reset
				</Button>
			</div>
		),
		filterIcon: filtered => (
			<Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select())
			}
		},
		render: text => (
			<Highlighter
				highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
				searchWords={[this.state.searchText]}
				autoEscape
				textToHighlight={text.toString()}
			/>
		)
	})

	render() {
		const components = {
			body: {
				cell: EditableCell
			}
		}

		const columns = this.columns.map(col => {
			if (!col.editable) {
				return col
			}
			return {
				...col,
				onCell: record => ({
					record,
					dataIndex: col.dataIndex,
					title: col.title,
					editing: this.isEditing(record)
				})
			}
		})

		return (
			<EditableContext.Provider value={this.props.form}>
				<Table
					size="small"
					components={components}
					bordered
					dataSource={this.props.data}
					columns={columns}
					rowClassName="editable-row"
					pagination={{
						onChange: this.cancel,
						pageSize: 15
					}}
				/>
			</EditableContext.Provider>
		)
	}
}

const EditableFormTable = Form.create()(EditableTable)
