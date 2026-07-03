const { genericInitializer } = require('./genericInitializer');

const subcategoriasXmovimientoConfig = {
    tableName: 'subcategoriasxmovimiento',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_subcategoriaxmovimiento') THEN
                CREATE TYPE estado_subcategoriaXmovimiento AS ENUM ('activo', 'inactivo');
            END IF;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE subcategoriasXmovimiento (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            subcategoria_id       UUID NOT NULL REFERENCES subcategorias(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            movimiento_id      UUID NOT NULL REFERENCES movimientos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            estado             estado_subcategoriaXmovimiento NOT NULL DEFAULT 'activo',                    
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `INSERT INTO subcategoriasXmovimiento (id, subcategoria_id, movimiento_id, estado) VALUES ($1, $2, $3, $4);`,
        rows: [
        ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'activo'],
        ['00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'activo']
         
        ]
    }
};

async function initSubcategoriasXmovimiento(client) {
    await genericInitializer(client, subcategoriasXmovimientoConfig);
}

module.exports = { initSubcategoriasXmovimiento };