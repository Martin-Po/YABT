const logger = require('../logger');
const bcrypt = require('bcrypt');
const { checkTableExists } = require('./checkTableExists');

async function initUsers(client) {
  try {
    const exists = await checkTableExists(client, 'users');

    if (!exists) {
      logger.info('La tabla "users" no existe. Inicializándola...');
      
      // Creamos la tabla (aquí ya no hace falta el IF NOT EXISTS porque ya chequeamos)
      await client.query(`
        CREATE TABLE users (
          id            SERIAL PRIMARY KEY,
          username      VARCHAR(255) UNIQUE NOT NULL,
          nombre        VARCHAR(255) NOT NULL,
          apellido      VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role          VARCHAR(20) CHECK (role IN ('admin', 'user')) NOT NULL,
          estado        INTEGER NOT NULL REFERENCES estados(id),
          fecha_alta    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
          fecha_baja    TIMESTAMPTZ DEFAULT NULL,
          token_version INTEGER DEFAULT 0
        );
      `);
      logger.info('✅ Tabla "users" creada con éxito.');
    } else {
      logger.info('ℹ️ La tabla "users" ya existe. Omitiendo creación.');
    }

    // Chequeo de registros para usuarios iniciales
    const result = await client.query('SELECT COUNT(*) AS cantidad FROM users');
    const usersCount = parseInt(result.rows[0].cantidad);

    if (usersCount === 0) {
      logger.info('La tabla de usuarios está vacía. Insertando registros semilla...');
      
      const adminPassword = await bcrypt.hash('admin123', 10);
      const userPassword = await bcrypt.hash('user456', 10);

      const queryInsert = `
        INSERT INTO users (username, nombre, apellido, password_hash, role, estado) 
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      await client.query(queryInsert, ['admin', 'Admin', 'System', adminPassword, 'admin', 1]);
      await client.query(queryInsert, ['user', 'Regular', 'User', userPassword, 'user', 1]);

      logger.info('✅ Usuarios semilla creados.');
    } else {
      logger.info(`La tabla de usuarios ya tiene ${usersCount} registros.`);
    }
  } catch (error) {
    logger.error('initUsuarios ERROR:', error);
    throw error;
  }
}

module.exports = { initUsers };