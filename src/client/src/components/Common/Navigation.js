import React, { Component } from 'react'
import { Menu, Select } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { logoutUser } from '../../redux/actions/authActions'

const { Option } = Select

class Navigation extends Component {
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

		if (isAuthenticated) {
			return (
				/* Authenticate */
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
					<Menu.Item key="5" style={{ float: 'right' }} onClick={() => this.props.logoutUser()}>
						Logout
					</Menu.Item>
				</Menu>
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
