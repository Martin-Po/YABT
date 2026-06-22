import axios from 'axios';
import loginService from '../services/login';

// Mock de Axios
jest.mock('axios');

describe('Login Service - Integración de Red (Cap. 2)', () => {
  
  test('debe enviar una petición POST a la ruta correcta', async () => {
    const credentials = { username: 'test', password: '123' };
    const mockData = { token: 'abc-123', username: 'test' };

    axios.post.mockResolvedValueOnce({ data: mockData });

    const result = await loginService.login(credentials);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/login'), 
      credentials
    );
    expect(result).toEqual(mockData);
  });
});