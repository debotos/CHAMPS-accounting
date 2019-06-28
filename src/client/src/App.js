import React from 'react'
import { Layout } from 'antd'
import { Router, Redirect, Switch } from 'react-router-dom'
import { createBrowserHistory as createHistory } from 'history'
import jwt_decode from 'jwt-decode'
import { Provider } from 'react-redux'

import Login from './components/Login'
import Admin from './components/Admin'
import Entry from './components/Entry'
import Summary from './components/Summary'

import PrivateRoute from './utils/PrivateRoute'
import PublicRoute from './utils/PublicRoute'

import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './redux/actions/authActions'
import store from './redux/store'
import Navigation from './components/Common/Navigation'

const { Header, Content, Footer } = Layout

if (localStorage.jwtToken) {
	console.log('jwtToken Exists!')
	// Set auth token header auth
	setAuthToken(localStorage.jwtToken)
	// Decode token and get user info and exp
	const decoded = jwt_decode(localStorage.jwtToken)
	// Set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded))

	// Check for expired token
	const currentTime = Date.now() / 1000
	console.log('current timestamp ', currentTime)
	if (decoded.exp < currentTime) {
		// Logout user
		store.dispatch(logoutUser())
	}
}

export const history = createHistory()

class App extends React.Component {
	state = { budgetYear: `${new Date().getFullYear() - 1} - ${new Date().getFullYear()}` }
	handleChange = value => {
		this.setState({ budgetYear: value })
	}
	render() {
		const { budgetYear } = this.state

		return (
			<Provider store={store}>
				<Router history={history}>
					<Layout style={{ minHeight: '100vh' }}>
						<Header className="header">
							<div className="logo">
								<h1 style={{ color: '#fff', margin: 0 }}>CHAMPS</h1>
							</div>
							<Navigation budgetYear={budgetYear} handleChange={this.handleChange} />
						</Header>
						<Content style={{ padding: '0 50px' }}>
							<Switch>
								<PublicRoute exact path="/" component={Login} />
								<PrivateRoute
									path="/summary"
									component={props => <Summary {...props} budgetYear={budgetYear} />}
								/>
								<PrivateRoute
									path="/entry"
									component={props => <Entry {...props} budgetYear={budgetYear} />}
								/>
								<PrivateRoute
									path="/admin"
									component={props => <Admin {...props} budgetYear={budgetYear} />}
								/>
								<Redirect to="/" />
							</Switch>
						</Content>
						<Footer style={{ textAlign: 'center' }}>
							©{new Date().getFullYear()} Created by Touhidur Rahman
						</Footer>
					</Layout>
				</Router>
			</Provider>
		)
	}
}

export default App
