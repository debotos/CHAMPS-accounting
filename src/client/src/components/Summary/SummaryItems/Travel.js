import React, { Component } from 'react'
import {
	Form,
	Input,
	Button,
	DatePicker,
	Table,
	Typography,
	Spin,
	Card,
	message,
	Switch,
	Icon
} from 'antd'
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'
import Highlighter from 'react-highlight-words'

import generateExcel from '../../../utils/generateExcel'

const { RangePicker } = DatePicker
const { Text, Paragraph } = Typography

export class Travel extends Component {
	componentDidMount() {
		this._bootstrap(this.props.budgetYear)
	}

	getBudget = async () => {
		try {
			this.setState({ loading: true })
			const response = await axios.get(`/api/v1/budget?budgetYear=${this.props.budgetYear}`)
			console.log('Budget got from server ', response.data)
			return response.data
		} catch (error) {
			console.log(error)
			message.error('Failed to load the Budget Data!')
		}
	}

	getBank = async () => {
		try {
			this.setState({ loading: true })
			const response = await axios.get(`/api/v1/bank?budgetYear=${this.props.budgetYear}`)
			console.log('Bank issued budget data got from server ', response.data)
			return response.data
		} catch (error) {
			console.log(error)
			message.error('Failed to load the Bank Data!')
		}
	}

	_bootstrap = async budgetYear => {
		try {
			this.setState({ loading: true })
			const response = await axios.get(`/api/v1/travels?budgetYear=${budgetYear}`)
			const data = response.data.map(x => ({ ...x, key: x._id })).reverse()
			const budget = await this.getBudget()
			const bank = await this.getBank()
			this.setState({ data, budget: budget.travel, bank: bank.travel }, () =>
				this.setState({ loading: false })
			)
		} catch (error) {
			console.log(error)
			message.error('Failed to load the data! Please refresh!')
		}
	}

	handleChange = value => {
		this.setState({ value })
	}

	onChange = checked => {
		this.setState({ showDetails: checked })
	}

	state = {
		loading: true,
		data: [],
		budget: 0,
		bank: 0,
		showDetails: false,
		/* Range Selector */
		value: []
	}

	render() {
		const { loading, budget, showDetails, value, bank } = this.state
		let { data } = this.state
		let totalMoney = 0
		data.forEach(x => (totalMoney = totalMoney + x.amount))
		let startDate
		let endDate
		if (value.length === 2) {
			startDate = value[0].valueOf()
			endDate = value[1].valueOf()
			data = data.filter(x => x.date >= startDate && x.date <= endDate)
		}
		data = data.map(x => ({
			...x,
			total: (x.amount ? x.amount : 0) + (x.it ? x.it : 0) + (x.vat ? x.vat : 0)
		}))

		if (loading) return <Spin size="large" />
		return (
			<>
				<Card title="Travel Budget Overview">
					<Card type="inner" title="Budget">
						<div style={{ display: 'flex' }}>
							<Text code>Original Budget:</Text>
							<Paragraph strong copyable>{`${numeral(budget).format('0,0.00')} ৳`}</Paragraph>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<Text code>Bank Issued:</Text>
							<Paragraph strong copyable>{`${numeral(bank).format('0,0.00')} ৳`}</Paragraph>
						</div>
					</Card>
					<Card
						style={{ marginTop: 16 }}
						type="inner"
						title="Cost"
						extra={
							<>
								<RangePicker
									placeholder={['Start month', 'End month']}
									format="DD-MM-YYYY"
									ranges={{
										'This Month': [moment().startOf('month'), moment().endOf('month')]
									}}
									value={value}
									onChange={this.handleChange}
									style={{ marginRight: '15px' }}
								/>
								<strong>View Details</strong>
								<Switch style={{ margin: '0 30px 0 10px' }} onChange={this.onChange} />
								<Button
									type="dashed"
									shape="circle"
									icon="download"
									size="small"
									onClick={() =>
										generateExcel(data, 'Travel', [
											'Voucher',
											'Date',
											'Name',
											'Designation',
											'Economic Code',
											'Payment Type',
											'D.A',
											'T.A',
											'Amount',
											'IT',
											'VAT',
											'Total'
										])
									}
								/>
							</>
						}
					>
						<div style={{ display: 'flex' }}>
							<Text code>Cost:</Text>
							<Paragraph strong copyable>{`${numeral(totalMoney).format('0,0.00')} ৳`}</Paragraph>
						</div>
					</Card>

					<Card style={{ marginTop: 16 }} type="inner" title="Balance">
						<div style={{ display: 'flex' }}>
							<Text code>Balance(Original):</Text>
							<Paragraph mark strong copyable>{`${numeral(budget - totalMoney).format(
								'0,0.00'
							)} ৳`}</Paragraph>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<Text code>Balance(Bank):</Text>
							<Paragraph mark strong copyable>{`${numeral(bank - totalMoney).format(
								'0,0.00'
							)} ৳`}</Paragraph>
						</div>
					</Card>
				</Card>
				<br />
				{showDetails && <DetailsTable data={data} />}
			</>
		)
	}
}

export default Travel

/*
	*******************************
	Below code for Generate Table
	*******************************
*/

const EditableContext = React.createContext()

class Cell extends React.Component {
	renderDataView = (children, record, field) => {
		switch (field) {
			case 'date':
				return `${moment(record[field]).format('ddd, MMM Do YY')} (${moment(record[field]).format(
					'DD-MM-YYYY'
				)})`
			case 'amount':
			case 'da':
			case 'ta':
			case 'it':
			case 'vat':
			case 'total':
				return `${numeral(record[field]).format('0,0.00')} ৳`
			case 'type':
				return <span style={{ textTransform: 'capitalize' }}>{record[field]}</span>
			default:
				return children
		}
	}

	renderCell = ({ getFieldDecorator }) => {
		const { dataIndex, title, record, index, children, ...restProps } = this.props
		return <td {...restProps}>{this.renderDataView(children, record, dataIndex)}</td>
	}

	render() {
		return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
	}
}

class TableView extends React.Component {
	constructor(props) {
		super(props)
		this.columns = [
			{
				title: 'Voucher',
				dataIndex: 'voucher',
				width: '10%',
				...this.getColumnSearchProps('voucher')
			},
			{
				title: 'Date',
				dataIndex: 'date',
				width: '15%',
				sorter: (a, b) => a.date - b.date
			},
			{
				title: 'D.A',
				dataIndex: 'da',
				width: '10%',
				// defaultSortOrder: 'descend',
				sorter: (a, b) => a.da - b.da
			},
			{
				title: 'T.A',
				dataIndex: 'ta',
				width: '10%',
				// defaultSortOrder: 'descend',
				sorter: (a, b) => a.ta - b.ta
			},
			{
				title: 'Name',
				dataIndex: 'name',
				width: '10%',
				...this.getColumnSearchProps('name')
			},
			{
				title: 'Designation',
				dataIndex: 'designation',
				width: '10%',
				...this.getColumnSearchProps('designation')
			},
			{
				title: 'Amount',
				dataIndex: 'amount',
				width: '10%',
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
				title: 'Total',
				dataIndex: 'total',
				width: '10%',
				editable: true,
				// defaultSortOrder: 'descend',
				sorter: (a, b) => a.total - b.total
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
			}
		]
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
				cell: Cell
			}
		}

		const columns = this.columns.map(col => {
			return {
				...col,
				onCell: record => ({
					record,
					dataIndex: col.dataIndex,
					title: col.title
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
					pagination={{ pageSize: 15 }}
				/>
			</EditableContext.Provider>
		)
	}
}

const DetailsTable = Form.create()(TableView)
