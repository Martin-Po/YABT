const { genericInitializer } = require('./genericInitializer');

const movimientosConfig = {
    tableName: 'movimientos',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_movimiento') THEN
                CREATE TYPE estado_movimiento AS ENUM ('activo', 'inactivo');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_movimiento') THEN
                CREATE TYPE tipo_movimiento AS ENUM ('transferencia', 'pago', 'cobro', 'ingreso');
            END IF;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE movimientos (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            usuario_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            cuenta_origen_id          UUID NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT ON UPDATE CASCADE,    
            cuenta_destino_id          UUID NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT ON UPDATE CASCADE,               
            monto              NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
            tipo              tipo_movimiento NOT NULL,
            comercio_id          UUID NOT NULL REFERENCES comercios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            usuario_responsable_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            fecha_pago         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            fecha_vencimiento         TIMESTAMPTZ DEFAULT NULL,
            grupo_cuota_id          UUID REFERENCES cuotagrupos(id) ON DELETE RESTRICT ON UPDATE CASCADE,  
            cuota_actual          INTEGER DEFAULT NULL,
            total_cuotas          INTEGER  DEFAULT NULL,            
            descripcion        VARCHAR(255) NOT NULL,            
            estado             estado_movimiento NOT NULL DEFAULT 'activo',                    
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `INSERT INTO movimientos (id, usuario_id, cuenta_origen_id, cuenta_destino_id, monto, tipo, comercio_id, usuario_responsable_id, descripcion, estado)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
        rows: [
        ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 100.00, 'transferencia', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Transferencia de prueba', 'activo'],
        ['00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 50.00, 'pago', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Pago de prueba', 'activo'],
        
        ]
    }
};

async function initMovimientos(client) {
    await genericInitializer(client, movimientosConfig);
}

module.exports = { initMovimientos };