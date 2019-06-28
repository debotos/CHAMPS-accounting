import axios from 'axios'

const setAuthToken = token => {
	if (token) {
		// Apply to every request
		axios.defaults.headers.common['Authentication'] = token
		axios.defaults.timeout = 0
	} else {
		// Delete auth header
		delete axios.defaults.headers.common['Authentication']
	}
}

export default setAuthToken
