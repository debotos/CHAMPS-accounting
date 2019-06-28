import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, notification } from 'antd'

import setAuthToken from '../../utils/setAuthToken'
import { setCurrentUser } from '../../redux/actions/authActions'

export class Login extends Component {
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
				console.log('Received values of Login form: ', values)
				axios
					.post(`/api/v1/users/login`, values)
					.then(response => {
						this.setState({ loading: false })
						const { token, user } = response.data
						// Set auth token header auth
						setAuthToken(token)
						localStorage.setItem('jwtToken', token)
						/* Save to Redux for app use*/
						/* Also it will instantly redirect the user */
						this.props.setUser(user)
					})
					.catch(error => {
						this.setState({ loading: false })
						let msg = 'Check Network Connection!'
						if (error.response) {
							console.log('Error Data: ', error.response.data)
							const keys = Object.keys(error.response.data)
							msg = error.response.data[keys[0]]
						}
						this.Nofify('error', msg, `Please contact to the admin if you don't have any account!`)
					})
			}
		})
	}

	render() {
		const { getFieldDecorator } = this.props.form
		const { loading } = this.state

		return (
			<div
				style={{ height: '100vh', display: 'flex', justifyContent: 'center', marginTop: '30vh' }}
			>
				<Form onSubmit={this.handleSubmit} style={{ width: '300px' }}>
					<Form.Item hasFeedback style={{ marginBottom: '5px' }}>
						{getFieldDecorator('email', {
							rules: [
								{
									type: 'email',
									message: 'The input is not valid E-mail!'
								},
								{
									required: true,
									message: 'Please input your E-mail!'
								}
							]
						})(
							<Input
								prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="Email"
							/>
						)}
					</Form.Item>
					<Form.Item hasFeedback style={{ marginBottom: '10px' }}>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please input your Password!' }]
						})(
							<Input.Password
								prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="Password"
							/>
						)}
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
							Log in
						</Button>
					</Form.Item>
				</Form>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	setUser: user => dispatch(setCurrentUser(user))
})

const LoginForm = Form.create({ name: 'login_form' })(Login)

export default connect(
	null,
	mapDispatchToProps
)(LoginForm)
