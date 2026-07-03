const { genericInitializer } = require('./genericInitializer');

const productosConfig = {
    tableName: 'productos',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_producto') THEN
                CREATE TYPE estado_producto AS ENUM ('activo', 'inactivo');
            END IF;
            if not exists (select 1 from pg_type where typname = 'unidad_medida') then
                create type unidad_medida as enum ('unidad', 'litro', 'kilogramo', 'metro', 'centimetro', 'mililitro');
            end if;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE productos (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nombre        VARCHAR(255) NOT NULL,
            descripcion        VARCHAR(255) NOT NULL,
            marca       VARCHAR(255) NOT NULL,
            categoria_id          UUID NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            subcategoria_id          UUID NOT NULL REFERENCES subcategorias(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            tipo_producto_id          UUID NOT NULL REFERENCES tiposProducto(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            unidad_medida_id          unidad_medida NOT NULL,
            contenido_neto        NUMERIC(15, 2) NOT NULL,            
            estado             estado_producto NOT NULL DEFAULT 'activo',                    
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `INSERT INTO productos (id, nombre, descripcion, marca, categoria_id, subcategoria_id, tipo_producto_id, unidad_medida_id, contenido_neto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
        rows: [
            ['00000000-0000-0000-0000-000000000001', 'Producto de prueba 1', 'Descripción de prueba 1', 'Marca de prueba 1', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'unidad', 100.00, 'activo'],
            ['00000000-0000-0000-0000-000000000002', 'Producto de prueba 2', 'Descripción de prueba 2', 'Marca de prueba 2', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'kilogramo', 200.00, 'activo']
        ]
    }
};

async function initProductos(client) {
    await genericInitializer(client, productosConfig);
}

module.exports = { initProductos };