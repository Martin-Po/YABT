const { genericInitializer } = require('./genericInitializer');

const usuariosXcuentaConfig = {
    tableName: 'usuariosxcuenta',
    enumQuery: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_usuarioxcuenta') THEN
            CREATE TYPE estado_usuarioXcuenta AS ENUM ('activo', 'inactivo');
            END IF;    
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol_usuario') THEN
                CREATE TYPE rol_usuario AS ENUM ('administrador', 'usuario', 'auditor');
            END IF;     
        END
        $$;
    `,
    createTableQuery: `
        CREATE TABLE usuariosXcuenta (
            id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            usuario_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            cuenta_id          UUID NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
            rol                rol_usuario NOT NULL,
            estado             estado_usuarioXcuenta NOT NULL DEFAULT 'activo',          
            fecha_alta         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            fecha_baja         TIMESTAMPTZ DEFAULT NULL,
            fecha_modificacion TIMESTAMPTZ DEFAULT NULL
        );
    `,
    seeds: {
        insertQuery: `
            INSERT INTO usuariosXcuenta (usuario_id, cuenta_id, rol, estado)
            VALUES ($1, $2, $3, $4);
        `,
        rows: [
            ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'administrador', 'activo'],
            ['00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'usuario', 'activo']            
        ]
    }
};

async function initUsuariosXcuenta(client) {
    await genericInitializer(client, usuariosXcuentaConfig);
}

module.exports = { initUsuariosXcuenta };