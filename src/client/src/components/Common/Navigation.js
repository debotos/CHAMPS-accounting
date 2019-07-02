import React, { Component } from 'react'
import { Menu, Select, Button, Modal, Spin, Card, Typography } from 'antd'
import axios from 'axios'
import numeral from 'numeral'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { logoutUser } from '../../redux/actions/authActions'

const { Option } = Select
const { Text, Paragraph } = Typography

class Navigation extends Component {
	state = { visible: false, content: null }
	getOverview = async () => {
		const response = await axios.get(`/api/v1/common/summary?budgetYear=${this.props.budgetYear}`)
		this.setState({ content: response.data })
	}
	showModal = () => {
		this.getOverview()
		this.setState({
			visible: true
		})
	}

	handleOk = e => {
		this.setState({
			content: null,
			visible: false
		})
	}
	handleCancel = e => {
		this.setState({
			content: null,
			visible: false
		})
	}
	render() {
		let YearOptions = []
		const currentYear = new Date().getFullYear()
		const fromYear = currentYear + 6 /* 6 Years ahead */
		const tillYear = currentYear - 10

		for (let year = fromYear; year !== tillYear; year--) {
			const ItemYear = `${year - 1} - ${year}`
			YearOptions.push(
				<Option key={`item_${year}`} value={ItemYear}>
					{ItemYear}
				</Option>
			)
		}

		const { isAuthenticated } = this.props
		const { content, visible } = this.state

		if (isAuthenticated) {
			return (
				/* Authenticate */
				<>
					<Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
						<Menu.Item key="1">
							Summary
							<Link to="/" />
						</Menu.Item>
						<Menu.Item key="2">
							Entry
							<Link to="/entry" />
						</Menu.Item>
						<Menu.Item key="3">
							Admin
							<Link to="/admin" />
						</Menu.Item>
						<Menu.Item key="4">
							<Select
								defaultValue={this.props.budgetYear}
								style={{ minWidth: 130 }}
								onChange={this.props.handleChange}
							>
								{YearOptions}
							</Select>
						</Menu.Item>
						<Menu.Item key="5">
							<Button onClick={this.showModal} type="primary">
								Year Overview
							</Button>
						</Menu.Item>
						<Menu.Item key="6" style={{ float: 'right' }} onClick={() => this.props.logoutUser()}>
							Logout
						</Menu.Item>
					</Menu>
					<Modal
						title="Whole Year Budget Overview"
						visible={visible}
						onOk={this.handleOk}
						onCancel={this.handleCancel}
					>
						{content ? (
							<>
								<Card type="inner" title="Budget">
									<div style={{ display: 'flex', justifyContent: 'space-around' }}>
										<div>
											<Text code>Original Budget:</Text>
											<Paragraph strong copyable>{`${numeral(content.originalBudget).format(
												'0,0.00'
											)} ৳`}</Paragraph>
										</div>
										&nbsp;
										<div>
											<Text code>Bank Issued:</Text>
											<Paragraph strong copyable>{`${numeral(content.bankIssued).format(
												'0,0.00'
											)} ৳`}</Paragraph>
										</div>
									</div>
								</Card>
								<Card style={{ marginTop: 16 }} type="inner" title="Cost">
									<div style={{ display: 'flex' }}>
										<Text code>Cost:</Text>
										<Paragraph strong copyable>{`${numeral(content.costTotal).format(
											'0,0.00'
										)} ৳`}</Paragraph>
									</div>
								</Card>

								<Card style={{ marginTop: 16 }} type="inner" title="Balance">
									<div style={{ display: 'flex', justifyContent: 'space-around' }}>
										<div>
											<Text code>Balance(Original):</Text>
											<Paragraph mark strong copyable>{`${numeral(content.balanceOriginal).format(
												'0,0.00'
											)} ৳`}</Paragraph>
										</div>
										&nbsp;
										<div>
											<Text code>Balance(Bank):</Text>
											<Paragraph mark strong copyable>{`${numeral(content.balanceBank).format(
												'0,0.00'
											)} ৳`}</Paragraph>
										</div>
									</div>
								</Card>
							</>
						) : (
							<Spin size="large" />
						)}
					</Modal>
				</>
			)
		} else {
			/* Non-Authenticate */
			return <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }} />
		}
	}
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
})
const mapDispatchToProps = dispatch => ({
	logoutUser: () => dispatch(logoutUser())
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Navigation)
