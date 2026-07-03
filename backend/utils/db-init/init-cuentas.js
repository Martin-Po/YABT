const { genericInitializer } = require('./genericInitializer');

const cuentasConfig = {
    tableName: 'cuentas',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_cuenta') THEN
                CREATE TYPE estado_cuenta AS ENUM ('activo', 'inactivo');
            END IF;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE cuentas (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            moneda             UUID NOT NULL REFERENCES monedas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            descripcion        VARCHAR(255) NOT NULL,
            balance            NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
            estado             estado_cuenta NOT NULL DEFAULT 'activo',          
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `
            INSERT INTO cuentas (id, moneda, descripcion, balance, estado)
            VALUES ($1, $2, $3, $4, $5);
        `,
        rows: [
            ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Cuenta de prueba 1', 1000.00, 'activo'],
            ['00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Cuenta de prueba 2', 500.00, 'activo']
        ]
    }
};

async function initCuentas(client) {
    await genericInitializer(client, cuentasConfig);
}

module.exports = { initCuentas };