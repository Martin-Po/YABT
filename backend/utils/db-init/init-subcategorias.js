const { genericInitializer } = require('./genericInitializer');

const subcategoriasConfig = {
    tableName: 'subcategorias',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_subcategoria') THEN
                CREATE TYPE estado_subcategoria AS ENUM ('activo', 'inactivo');
            END IF;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE subcategorias (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            categoria_id       UUID NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            nombre             VARCHAR(255) NOT NULL,
            descripcion        VARCHAR(255),
            icono            varchar(255),
            estado             estado_subcategoria NOT NULL DEFAULT 'activo',          
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `
            INSERT INTO subcategorias (id, categoria_id, nombre, descripcion, icono, estado)
            VALUES ($1, $2, $3, $4, $5, $6);
        `,
        rows: [
            ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Categoría de prueba 1', 'Descripción de prueba 1', 'icono1.png', 'activo'],
            ['00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Categoría de prueba 2', 'Descripción de prueba 2', 'icono2.png', 'activo']            
        ]
    }
};

async function initSubsubcategorias(client) {
    await genericInitializer(client, subcategoriasConfig);
}

module.exports = { initSubsubcategorias };