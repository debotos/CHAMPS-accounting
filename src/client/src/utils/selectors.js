// Filter An Array [Used to Search a list/array by text]
export const filterOtherUsers = (ItemsArray, { text }) => {
	if (!ItemsArray) {
		ItemsArray = []
	}
	// console.log('Filter Data => ', ItemsArray);
	// console.log('Filter Text =>', text);
	return ItemsArray.filter(singleItem => {
		let allDetails = singleItem.full_name + singleItem.email
		const textMatch = allDetails.toLowerCase().includes(text)
		return textMatch
		//eslint-disable-next-line
	}).sort((a, b) => (a.user_name < b.user_name ? -1 : 1))
}
