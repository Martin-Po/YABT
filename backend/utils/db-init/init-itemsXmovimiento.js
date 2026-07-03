const { genericInitializer } = require('./genericInitializer');

const itemsXmovimientoConfig = {
    tableName: 'itemsxmovimiento',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_itemxmovimiento') THEN
                CREATE TYPE estado_itemXmovimiento AS ENUM ('activo', 'inactivo');
            END IF;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE itemsXmovimiento (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            descripcion        VARCHAR(255) NOT NULL,
            movimiento_id          UUID NOT NULL REFERENCES movimientos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            producto_id          UUID REFERENCES productos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            monto              NUMERIC(15, 2) NOT NULL,
            cantidad           NUMERIC(15, 2) NOT NULL,
            estado             estado_itemXmovimiento NOT NULL DEFAULT 'activo',                    
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `INSERT INTO itemsXmovimiento (id, descripcion, movimiento_id, monto, cantidad, estado) 
        VALUES ($1, $2, $3, $4, $5, $6);`,
        rows: [
            ['00000000-0000-0000-0000-000000000001', 'Item de prueba 1', '00000000-0000-0000-0000-000000000001', 100.00, 2, 'activo'],
            ['00000000-0000-0000-0000-000000000002', 'Item de prueba 2', '00000000-0000-0000-0000-000000000002', 200.00, 3, 'activo']
        ]
    }
};

async function initItemXmovimientos(client) {
    await genericInitializer(client, itemsXmovimientoConfig);
}

module.exports = { initItemXmovimientos };