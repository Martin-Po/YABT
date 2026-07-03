const { genericInitializer } = require('./genericInitializer');

const tiposProductoConfig = {
    tableName: 'tiposproducto',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_tipoproducto') THEN
                CREATE TYPE estado_tipoProducto AS ENUM ('activo', 'inactivo');
            END IF;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE tiposProducto (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nombre        VARCHAR(255) NOT NULL,
            estado             estado_tipoProducto NOT NULL DEFAULT 'activo',                    
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `INSERT INTO tiposProducto (id, nombre, estado) VALUES ($1, $2, $3);`,
        rows: [
         ['00000000-0000-0000-0000-000000000001', 'Tipo de Producto 1', 'activo'],
         ['00000000-0000-0000-0000-000000000002', 'Tipo de Producto 2', 'activo']
        ]
    }
};

async function initTiposProducto(client) {
    await genericInitializer(client, tiposProductoConfig);
}

module.exports = { initTiposProducto };