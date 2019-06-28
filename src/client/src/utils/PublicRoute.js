import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

export const PublicRoute = ({ auth, component: Component, ...restVars }) => (
	<Route
		{...restVars}
		component={props =>
			auth.isAuthenticated ? <Redirect to="/summary" /> : <Component {...props} />
		}
	/>
)

const mapStateToProps = state => ({
	auth: state.auth
})

export default connect(
	mapStateToProps,
	null
)(PublicRoute)
