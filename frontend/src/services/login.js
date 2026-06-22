import axios from 'axios'
import {logger} from '../utils/logger'


const baseUrl = import.meta.env.MODE === 'development'
  ? 'http://localhost:3001/api/login'
  : '/api/login'


// eslint-disable-next-line no-unused-vars
let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

export const clearToken = () => {
    token = null
  }

const login = async (credentials) => {
    const response = await axios.post(baseUrl, credentials)
    logger.debug(response)
    return response.data
}

const logout = () => {
    const config = {
        headers: { Authorization: token },
    }
    const request = axios.get(`${baseUrl}/logout`, config)
    return request.then(response => response.data)
}

const checkUser = async () => {
    const stored = localStorage.getItem('loggedUser');
    const parsed = stored ? JSON.parse(stored) : null;

    logger.debug('Configuración de conexión a MySQL:', {
        stored,
        parsed
    });

    if (!parsed || !parsed.user || !parsed.token) {
        throw new Error('Credenciales incorrectas.');
    }

    const token = parsed.token;

    try {
        const config = {
            headers: { Authorization: 'Bearer ' + token },
        };
        const response = await axios.post(`${baseUrl}/checkuser`, parsed.user, config);
        return response.data;
    } catch (error) {
        logger.error('Error al verificar el usuario:', error);
        throw error; // Propagás el error para manejarlo donde llames a checkUser()
    }
};


export default { login, logout, setToken, checkUser, clearToken }
