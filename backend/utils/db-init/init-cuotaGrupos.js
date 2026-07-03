const { genericInitializer } = require('./genericInitializer');

const cuotaGruposConfig = {
    tableName: 'cuotagrupos',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_cuotagrupo') THEN
                CREATE TYPE estado_cuotaGrupo AS ENUM ('activo', 'inactivo');
            END IF;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE cuotaGrupos (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nombre        VARCHAR(255) NOT NULL,
            cuotas        INTEGER NOT NULL DEFAULT 1,
            monto_total        NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
            monto_efectivo        NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
            moneda             UUID NOT NULL REFERENCES monedas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            estado             estado_cuotaGrupo NOT NULL DEFAULT 'activo',          
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `
            INSERT INTO cuotaGrupos (id, nombre, cuotas, monto_total, monto_efectivo, moneda, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        rows: [
            ['00000000-0000-0000-0000-000000000001', 'Cuotas de prueba 1', 10, 1000.00, 100.00, '00000000-0000-0000-0000-000000000001', 'activo'],
            ['00000000-0000-0000-0000-000000000002', 'Cuotas de prueba 2', 10, 500.00, 250.00, '00000000-0000-0000-0000-000000000002', 'activo']
        ]
    }
};

async function initCuotaGrupos(client) {
    await genericInitializer(client, cuotaGruposConfig);
}

module.exports = { initCuotaGrupos };