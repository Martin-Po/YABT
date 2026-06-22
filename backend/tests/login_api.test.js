const supertest = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app'); 
const { pool } = require('../utils/db');
const config = require('../utils/config');

config.TOKEN_SECRET = config.TOKEN_SECRET || 'test_secret_para_entorno_local';

const api = supertest(app);

// Mockeo manual: Interceptamos la DB para no romper nada real
jest.mock('../utils/db', () => ({
  pool: { query: jest.fn() }
}));

describe('Pruebas de API Críticas', () => {

  // Limpiar mocks antes de cada test para evitar "arrastre" de datos
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RUTA HEALTH: El backend responde correctamente', async () => {
    await api
      .get('/api/health')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('LOGIN: Falla con credenciales erróneas', async () => {
    // Simulamos que la DB devuelve vacío
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await api
      .post('/api/login')
      .send({ username: 'inexistente', password: '123' })
      .expect(401);

    expect(response.body.error).toBeDefined();
  });

  test('LOGIN: Éxito y generación de Token', async () => {
    const passHash = await bcrypt.hash('pass123', 10);
    const mockUser = {
      id: 1,
      username: 'admin',
      password_hash: passHash,
      token_version: 0
    };

    // 1. Simula el SELECT del usuario
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });
    // 2. Simula el UPDATE de la versión del token
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const response = await api
      .post('/api/login')
      .send({ username: 'admin', password: 'pass123' })
      .expect(200);

    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe('string');
  });

  test('SESIÓN: El token queda invalidado si la versión en DB cambia', async () => {
    // Token con versión 0
    const token = jwt.sign(
      { id: 1, username: 'admin', tokenVersion: 0 }, 
      config.TOKEN_SECRET
    );

    // DB ya tiene versión 1 (ej: por un logout)
    pool.query.mockResolvedValueOnce({ 
      rows: [{ id: 1, username: 'admin', token_version: 1 }] 
    });

    await api
      .post('/api/login/checkuser')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});