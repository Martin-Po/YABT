const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const middleware = require('../utils/middleware')
const config = require('../utils/config')
const { pool } = require('../utils/db') // ahora sí funciona bien
const logger = require('../utils/logger')


loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    if (!username) {
        return response.status(409).json({ error: 'Username not provided' })
    }

    if (!password) {
        return response.status(409).json({ error: 'Password not provided' })
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
        
        if (result.rows.length === 0) {
            return response.status(401).json({ error: 'invalid username or password' })
        }

        const user = result.rows[0]


        const passwordCorrect =
            user === null
                ? false
                : await bcrypt.compare(password, user.password_hash)


                logger.debug(`En el login user: ${user}`, user)
                logger.debug(`En el login pass: ${passwordCorrect}`, passwordCorrect)

        if (!user || !passwordCorrect) {
            return response.status(401).json({
                error: 'invalid username or password',
            })
        }

        const newTokenVersion = user.token_version + 1;
        await pool.query('UPDATE users SET token_version = $1 WHERE id = $2', [newTokenVersion, user.id])

        const userForToken = {
            username: user.username,
            id: user.id,
            role: user.role,
            tokenVersion: newTokenVersion, // Incluir la nueva versión en el token
        };

        const token = jwt.sign(userForToken, config.TOKEN_SECRET, {
            // expiresIn: 60 * 60,
        })

        response.status(200).send({
            token,
            username: user.username,
            name: user.nombre,
            role: user.role,
        })
    } catch (error) {
        logger.error('Error al obtener la conexión a la base de datos:', error);
        response.status(500).json({ error: 'internal server error' })
    }
})

loginRouter.get('/logout', middleware.userExtractor, async (request, response) => {
  let connection;
  try {
    const user = request.user;

    if (!user) {
      return response.status(401).json({ error: 'Usuario no autenticado' });
    }

    await pool.query('UPDATE users SET token_version = token_version + 1 WHERE id = $1', [user.id])

    logger.info(`Usuario cerró sesión: ${user.username}`)

    return response.status(200).json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    logger.error('Error al cerrar sesión:', {
      error: error.message,
      user: request.user?.username,
      userId: request.user?.id,
    });
    return response.status(500).json({ error: 'Error al cerrar sesión' });
  } 
});

loginRouter.post('/checkuser', middleware.userExtractor, async (request, response, next) => {
        response.status(200).end()
    }
)

module.exports = loginRouter
