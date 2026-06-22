const { Pool } = require('pg');
const config = require('./config');
const logger = require('./logger');

let pool;

// Inicializamos el pool inmediatamente para que esté disponible como objeto
if (!pool) {
  pool = new Pool({
    host: config.DB_HOST || 'db',
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    port: 5432,
    // Configuraciones recomendadas para un pool saludable
    max: 20, // Máximo de conexiones simultáneas
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

/**
 * Mantiene la compatibilidad con tu código actual.
 * Retorna un CLIENTE (requiere .release() manual).
 */
const getDb = async (retries = 10, delay = 3000) => {
  while (retries > 0) {
    try {
      const client = await pool.connect();
      logger.info('🐘 Conexión a PostgreSQL exitosa (Client)');
      return client; 
    } catch (error) {
      retries--;
      logger.error(`Error conectando a Postgres: ${error.message}`);
      if (retries === 0) throw error;
      logger.info(`Reintentando en ${delay/1000}s... (Intentos: ${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Exportamos el pool directamente para usar pool.query() en middlewares
// y getDb para lo que ya tenés funcionando.
module.exports = { 
  getDb,
  pool 
};