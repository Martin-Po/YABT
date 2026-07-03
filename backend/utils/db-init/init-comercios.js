const { genericInitializer } = require('./genericInitializer');

const comerciosConfig = {
    tableName: 'comercios',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_comercio') THEN
                CREATE TYPE estado_comercio AS ENUM ('activo', 'inactivo');
            END IF;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE comercios (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nombre             VARCHAR(255) NOT NULL,
            descripcion        VARCHAR(255),
            sucursal         VARCHAR(255) NOT NULL,
            estado             estado_comercio NOT NULL DEFAULT 'activo',          
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `
            INSERT INTO comercios (id, nombre, descripcion, sucursal, estado)
            VALUES ($1, $2, $3, $4, $5);
        `,
        rows: [
            ['00000000-0000-0000-0000-000000000001', 'Categoría de prueba 1', 'Descripción de prueba 1', 'Sucursal 1', 'activo'],
            ['00000000-0000-0000-0000-000000000002', 'Categoría de prueba 2', 'Descripción de prueba 2', 'Sucursal 2', 'activo']            
        ]
    }
};

async function initComercios(client) {
    await genericInitializer(client, comerciosConfig);
}

module.exports = { initComercios };