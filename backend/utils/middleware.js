const logger = require('./logger');
const config = require('../utils/config')
const pool = require('./db').pool;
const jwt = require('jsonwebtoken');

const requestLogger = (request, response, next) => {

  logger.info('Petición recibida', {
    method: request.method,
    path: request.path,
    body: request.body,
  });
  next();
};

const unknownEndpoint = (request, response) => {
  logger.warn(`Endpoint desconocido solicitado: ${request.method} ${request.originalUrl}`);
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(`${error.name}: ${error.message}`, { stack: error.stack });

  // Errores conocidos
  if (error.name === 'CastError') return response.status(400).send({ error: 'malformatted id' });
  if (error.name === 'ValidationError') return response.status(400).json({ error: error.message });
  if (error.name === 'JsonWebTokenError') return response.status(401).json({ error: 'invalid token' });
  if (error.name === 'TokenExpiredError') return response.status(401).json({ error: 'token expired' });

  // Error genérico (para que nunca devuelva HTML)
  const statusCode = error.statusCode || 500;
  const message = config.NODE_ENV === 'development' 
    ? error.message 
    : 'Something went wrong in the server';

  response.status(statusCode).json({ error: message });
};


const tokenExtractor = async (request, response, next) => {
  const authorization = await request.get('authorization')
  logger.debug('Authorization en token extractor:', authorization);  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    request.token = token
    logger.debug('Token extraído: ', token);
  }
  next()
}

const userExtractor = async (request, response, next) => {


  logger.debug(`Token: " ${request.token}`)
  logger.debug(`URL: ${request.originalUrl}`)
  logger.debug(`Token: ${request.token}`);
  logger.debug(`Token secreto: ${config.TOKEN_SECRET}`);


  let decoded
  try {
    decoded = jwt.verify(request.token, config.TOKEN_SECRET)
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return response.status(401).json({ error: 'token expired' })
    }
    logger.error('Error al verificar el token:', e)
    return response.status(401).json({ error: 'token invalid' })
  }

  logger.debug('token decodificado:', decoded)
  logger.debug('user id:', decoded.id);


  const userId = decoded.id   // <-- aquí
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    
    const user = result.rows[0];
    if (!user) {
      return response.status(401).json({ error: 'User not found' });
    }

    logger.debug('user.tokenVersion', user)


    if (decoded.tokenVersion !== user.token_version) {
      logger.error('Error al verificar version de token:')
      return response.status(401).json({ error: 'Token expired or invalid' });
    }

    request.user = user
  } catch (err) {
    logger.error(`Error al traer el usuario`, err)
    return response.status(500).json({ error: 'internal server error' })
  }  
  next()
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}