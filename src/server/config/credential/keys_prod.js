/*
	In Production, also set: (It is a must!!!)
	NODE_ENV: production
*/

module.exports = {
	mongoURI: process.env.MONGO_URI,
	jwtPrivateKey: process.env.JWT_PRIVATE_KEY
}
