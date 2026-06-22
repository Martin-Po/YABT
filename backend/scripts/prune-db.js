// backend/scripts/prune-db.js
const { getDb } = require("../utils/db");
const logger = require('../utils/logger');

async function pruneDatabase() {
    let connection;
    try {
        console.log("\n--- 🧨 INICIANDO LIMPIEZA DE BASE DE DATOS ---");
        connection = await getDb();

        logger.warn("🔥 [CRITICAL] Ejecutando DROP SCHEMA public CASCADE...");
        await connection.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
        
        console.log("✅ Esquema public reiniciado con éxito.");
        console.log("--- 🏁 LIMPIEZA COMPLETADA ---\n");
        
        process.exit(0); // Salida exitosa
    } catch (error) {
        logger.error('❌ Error fatal durante el PRUNE:', error);
        process.exit(1); // Salida con error
    }
}

pruneDatabase();