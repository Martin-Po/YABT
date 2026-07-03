const { genericInitializer } = require('./genericInitializer');

const categoriasConfig = {
    tableName: 'categorias',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_categoria') THEN
                CREATE TYPE estado_categoria AS ENUM ('activo', 'inactivo');
            END IF;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE categorias (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nombre             VARCHAR(255) NOT NULL,
            descripcion        VARCHAR(255),
            icono            varchar(255),
            estado             estado_categoria NOT NULL DEFAULT 'activo',          
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `
            INSERT INTO categorias (id, nombre, descripcion, icono, estado)
            VALUES ($1, $2, $3, $4, $5);
        `,
        rows: [
            ['00000000-0000-0000-0000-000000000001', 'Categoría de prueba 1', 'Descripción de prueba 1', 'icono1.png', 'activo'],
            ['00000000-0000-0000-0000-000000000002', 'Categoría de prueba 2', 'Descripción de prueba 2', 'icono2.png', 'activo']            
        ]
    }
};

async function initCategorias(client) {
    await genericInitializer(client, categoriasConfig);
}

module.exports = { initCategorias };