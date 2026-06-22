const logger = require('../logger');
const { checkTableExists } = require('./checkTableExists');

async function initEstados(client) {
  try {
    const exists = await checkTableExists(client, 'estados');

    if (!exists) {
      logger.info('La tabla "estados" no existe. Inicializándola...');

      // Creamos la tabla (aquí ya no hace falta el IF NOT EXISTS porque ya chequeamos)
      await client.query(`
        CREATE TABLE estados (
          id            SERIAL PRIMARY KEY,
          tipo          VARCHAR(255) NOT NULL,
          nombre        VARCHAR(255) NOT NULL,
          codigo        VARCHAR(255) NOT NULL,
          descripcion   VARCHAR(255) NOT NULL,
          activo        boolean NOT NULL DEFAULT true,
          fecha_alta    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
          fecha_baja    TIMESTAMPTZ DEFAULT NULL
        );
      `);
      logger.info('✅ Tabla "estados" creada con éxito.');
    } else {
      logger.info('ℹ️ La tabla "estados" ya existe. Omitiendo creación.');
    }

    // Chequeo de registros para estados iniciales
    const result = await client.query('SELECT COUNT(*) AS cantidad FROM estados');
    const estadosCount = parseInt(result.rows[0].cantidad);

    if (estadosCount === 0) {
      logger.info('La tabla de estados está vacía. Insertando registros semilla...');

      const queryInsert = `
        INSERT INTO estados (tipo, nombre, codigo, descripcion, activo)
        VALUES ($1, $2, $3, $4, $5)
      `;

      await client.query(queryInsert, ['usuario', 'ACTIVO', 'A', 'Usuario activo', true]);
      await client.query(queryInsert, ['usuario', 'BAJAA', 'B', 'Usuario de baja', true]);

      logger.info('✅ Estados semilla creados.');
    } else {
      logger.info(`La tabla de usuarios ya tiene ${estadosCount} registros.`);
    }
  } catch (error) {
    logger.error('initEstados ERROR:', error);
    throw error;
  }
}

module.exports = { initEstados };