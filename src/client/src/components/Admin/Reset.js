import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, notification } from 'antd'

import { logoutUser } from '../../redux/actions/authActions'

export class PasswordReset extends Component {
	Nofify = (type, title, body) => {
		notification[type]({
			message: title,
			description: body
		})
	}

	state = { loading: false }

	handleSubmit = e => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ loading: true })
				console.log('Received values of PasswordReset form: ', values)
				axios
					.post(`/api/v1/users/me/edit/password`, values)
					.then(response => {
						const { success } = response.data
						/* Logout the user and tell him to login again */
						if (success) {
							this.setState({ loading: false })
							this.Nofify(
								'success',
								'Password Successfully Updated!',
								`Please login again to continue!`
							)
							setTimeout(this.props.logoutUser(), 100)
						}
					})
					.catch(error => {
						this.setState({ loading: false })
						let msg = 'Check Network Connection!'
						if (error.response) {
							console.log('Error Data: ', error.response.data)
							const keys = Object.keys(error.response.data)
							msg = error.response.data[keys[0]]
						}
						this.Nofify('error', msg, `Please contact to the Admin for more info!`)
					})
			}
		})
	}

	render() {
		const { getFieldDecorator } = this.props.form
		const { loading } = this.state

		return (
			<Form onSubmit={this.handleSubmit} style={{ width: '300px' }}>
				<Form.Item hasFeedback style={{ marginBottom: '5px' }}>
					{getFieldDecorator('cpassword', {
						rules: [{ required: true, message: 'Please input your current Password!' }]
					})(
						<Input.Password
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="Current Password"
						/>
					)}
				</Form.Item>
				<Form.Item hasFeedback style={{ marginBottom: '5px' }}>
					{getFieldDecorator('password', {
						rules: [{ required: true, message: 'Please input your new Password!' }]
					})(
						<Input.Password
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="New Password"
						/>
					)}
				</Form.Item>
				<Form.Item hasFeedback style={{ marginBottom: '10px' }}>
					{getFieldDecorator('password2', {
						rules: [{ required: true, message: 'Please confirm new Password!' }]
					})(
						<Input.Password
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="Confirm New Password"
						/>
					)}
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
						Change Password
					</Button>
				</Form.Item>
			</Form>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	logoutUser: () => dispatch(logoutUser())
})

const PasswordResetForm = Form.create({ name: 'reset_form' })(PasswordReset)

export default connect(
	null,
	mapDispatchToProps
)(PasswordResetForm)
