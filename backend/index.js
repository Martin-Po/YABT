const app = require('./app')
const http = require('http')
const config = require('./utils/config')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`🚀 MTX_AppTitle corriendo en puerto ${config.PORT}`)
  console.log(`🌍 Entorno: ${config.NODE_ENV}`)
})