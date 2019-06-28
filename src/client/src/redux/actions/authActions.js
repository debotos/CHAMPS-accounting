import { SET_CURRENT_USER } from './types'
import setAuthToken from '../../utils/setAuthToken'

// Set logged in user
export const setCurrentUser = user => {
	return {
		type: SET_CURRENT_USER,
		payload: user
	}
}

// Logout user
export const logoutUser = () => dispatch => {
	// Remove token from localStorage
	localStorage.removeItem('jwtToken')
	// Remove auth header for future requests
	setAuthToken(false)
	// Set current user to {} which will set isAuthenticated to false
	dispatch(setCurrentUser({}))
	// window.location.reload()
}
