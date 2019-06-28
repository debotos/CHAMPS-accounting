import axios from 'axios'

const version = 'v1'

export default async (method, voucher) => {
	console.log(`/api/${version}/${method}?voucher=${voucher}`)
	const response = await axios.get(
		`/api/${version}/${method}?voucher=${encodeURIComponent(voucher)}`
	)
	if (response.data.length > 0) {
		return true
	} else {
		return false
	}
}
