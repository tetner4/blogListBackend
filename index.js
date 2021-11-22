const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})