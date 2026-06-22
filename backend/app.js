const express = require('express')
const cors = require('cors')
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
// require('express-async-errors') // Para manejar errores en rutas async sin try/catch extra

const app = express()

const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)




// Importa la función para inicializar usuarios
const { initializeDBIfEmpty } = require('./utils/postgress-init');

initializeDBIfEmpty()
  .then(() => {
    logger.info('Proceso de verificación/creación de base de datos  completado.');
  })
  .catch((error) => {
    logger.error('Error durante el proceso de verificación/creación de base de datos:', error);
  });

// Rutas (las iremos agregando acá)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MTX_AppTitle' })
})

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


logger.debug('Aplicación iniciada en modo ' + config.NODE_ENV)

module.exports = app