const logger = require('../logger');
const { checkTableExists } = require('./checkTableExists');

async function genericInitializer(client, config) {
    const { tableName, enumQuery, createTableQuery, seeds } = config;

    try {
        const exists = await checkTableExists(client, tableName);

        if (!exists) {
            logger.info(`La tabla "${tableName}" no existe. Inicializándola...`);
            
            // 1. Crear ENUMs si existen para esta tabla
            if (enumQuery) {
                await client.query(enumQuery);
            }

            // 2. Crear la tabla
            await client.query(createTableQuery);
            logger.info(`✅ Tabla "${tableName}" creada con éxito.`);
        } else {
            logger.info(`ℹ️ La tabla "${tableName}" ya existe. Omitiendo creación.`);
        }

        // 3. Manejo de Semillas (Seeds)
        if (seeds && seeds.rows.length > 0) {
            const result = await client.query(`SELECT COUNT(*) AS cantidad FROM ${tableName}`);
            const currentCount = parseInt(result.rows[0].cantidad);

            if (currentCount === 0) {
                logger.info(`La tabla "${tableName}" está vacía. Insertando registros semilla...`);
                
                // Ejecutamos las inserciones de forma secuencial segura para el cliente
                for (const rowData of seeds.rows) {
                    await client.query(seeds.insertQuery, rowData);
                }
                
                logger.info(`✅ Registros semilla creados para "${tableName}".`);
            } else {
                logger.info(`ℹ️ La tabla "${tableName}" ya tiene ${currentCount} registros.`);
            }
        }
    } catch (error) {
        logger.error(`❌ Error fatal en inicialización de tabla "${tableName}":`, error);
        throw error; // Re-lanzamos para que el orquestador principal sepa que falló
    }
}

module.exports = { genericInitializer };