import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import loginService from '../services/login';

import { logger } from '../utils/logger'; // Asegurate de importar el logger

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useAlert } from '../context/AlertContext';


const PrivateRoutes = () => {
  const [authorized, setAuthorized] = useState(false); // mejor iniciar en false
  const [loading, setLoading] = useState(true); // para evitar parpadeo
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await loginService.checkUser();
        setAuthorized(true);
      } catch (error) {

     const isAxiosError = error.response !== undefined;

    const status = isAxiosError ? error.response.status : null;
    const errorMessage = isAxiosError
      ? error.response?.data?.error || error.message
      : error.message;

        logger.error('Status:', status);
        logger.error('Error message:', errorMessage);
        logger.error('Full error:', error);
        logger.error('Messaje:', error.error)

        if (status === 401 && errorMessage === 'token expired') {
          localStorage.removeItem('loggedUser')
          showAlert({ message: 'Token expirado', severity: 'error', type: 'tokenExpired', duration: 0 });
        }
        else if (status === null && errorMessage === 'Credenciales incorrectas.')
        {
          showAlert({ message: `${errorMessage}`, severity: 'error', type: 'popup', duration: 3000 });
        }
        else 
        {
          showAlert({ message: `Error: ${errorMessage || 'No autorizado'}`, severity: 'error', type: 'popup' });
        }
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return null; // o un loader/spinner

  return authorized ? (
    <div style={{ display: 'flex' }}>
      
      <main style={{ flexGrow: 1 }}>
        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
            
          </Box>
          )}
        

        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export { PrivateRoutes };
