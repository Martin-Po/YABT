const config = require('./config');
const { getDb } = require("./db");
const logger = require('./logger');
const { initUsers } = require('./db-init/init-users');
const { initEstados } = require('./db-init/init-estados');
const { initCuentas } = require('./db-init/init-cuentas');
const { initMonedas } = require('./db-init/init-monedas');
const { initCategorias } = require('./db-init/init-categorias');
const { initSubsubcategorias } = require('./db-init/init-subcategorias');
const { initUsuariosXcuenta } = require('./db-init/init-usuariosXcuenta');
const { initComercios } = require('./db-init/init-comercios');
const { initCuotaGrupos } = require('./db-init/init-cuotaGrupos');
const { initMovimientos } = require('./db-init/init-movimientos');
const { initTiposProducto } = require('./db-init/init-tipoproducto');
const { initProductos } = require('./db-init/init-productos');
const { initItemXmovimientos } = require('./db-init/init-itemsXmovimiento');
const { initCategoriasXmovimiento } = require('./db-init/init-categoriasXmovimiento');
const { initSubcategoriasXmovimiento } = require('./db-init/init-subcategoriasXmovimiento');

async function initializeDBIfEmpty() {

    host = config.MYSQL_HOST,
    user = config.MYSQL_USER,
    password = config.MYSQL_PASSWORD,
    database = config.MYSQL_DATABASE,

    logger.debug('Configuración de conexión a MySQL:', {
      host,
      user,
      password: password ? '********' : 'No password provided',
      database
    });
  let connection;
  try {


    const initSteps = [
      { name: 'initEstados', fn: initEstados },
      { name: 'initUsers', fn: initUsers },
      { name: 'initMonedas', fn: initMonedas },
      { name: 'initCuentas', fn: initCuentas },
      { name: 'initCategorias', fn: initCategorias },
      { name: 'initSubCategorias', fn: initSubsubcategorias },
      { name: 'initUsuariosXCuenta', fn: initUsuariosXcuenta },
      { name: 'initComercios', fn: initComercios },
      { name: 'initCuotaGrupos', fn: initCuotaGrupos },
      { name: 'initMovimientos', fn: initMovimientos },
      { name: 'initTiposProductos', fn: initTiposProducto },
      { name: 'initProductos', fn: initProductos },
      {name: 'initItemsXmovimiento', fn: initItemXmovimientos},
      {name: 'initCategoriasXmovimiento', fn: initCategoriasXmovimiento},
      {name: 'initSubcategoriasXmovimiento', fn: initSubcategoriasXmovimiento}

    ];

    connection = await getDb();


    for (const step of initSteps) {
      try {
        await step.fn(connection);
      } catch (err) {
        logger.error(`${step.name} ERROR:`, err);
      }
    }



  } catch (error) {
    logger.error('Error FATAL en initializeAll():', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}



module.exports = { initializeDBIfEmpty };