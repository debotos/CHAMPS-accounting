const app = require('./src/server')
const logger = require('./src/server/config/logger')

const port = process.env.PORT || 5001

app.listen(port, () => logger.info(` 💻  Server started on port ${port} 🌎 `))
