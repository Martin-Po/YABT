const { genericInitializer } = require('./genericInitializer');

const monedasConfig = {
    tableName: 'monedas',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_moneda') THEN
                CREATE TYPE estado_moneda AS ENUM ('activo', 'inactivo');
            END IF;
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE monedas (
            id                 SERIAL PRIMARY KEY,
            descripcion        VARCHAR(255) NOT NULL,
            simbolo            VARCHAR(10) NOT NULL,
            estado             estado_moneda NOT NULL DEFAULT 'activo',                    
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `INSERT INTO monedas (descripcion, simbolo, estado) VALUES ($1, $2, $3);`,
        rows: [
            ['Dólar', 'USD', 'activo'],
            ['Peso', 'ARS', 'activo']
        ]
    }
};

async function initMonedas(client) {
    await genericInitializer(client, monedasConfig);
}

module.exports = { initMonedas };