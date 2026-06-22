import { Box, Alert, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logger } from '../utils/logger';

export function AlertBox({ message, type, severity, onClose, error }) {
    const navigate = useNavigate();

    logger.debug('En el manejo de alerta', error)

    if (error)
    {
        const isAxiosError = error.response !== undefined;
    
        message = isAxiosError
          ? error.response?.data?.error || error.message
          : error.message;
    }
    

    if (type === 'tokenExpired' || message === 'token expired') {
        const handleClose = () => {
            logger.debug('Haciendo click')
            onClose(); // Esto borra la alerta (setAlert(null))
            navigate('/login'); // Luego navega al login
        };

        return (
            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                }}
            >
                <Box
                    sx={{
                        backgroundColor: '#f44336',
                        color: '#fff',
                        p: 4,
                        borderRadius: 2,
                        width: '90%',
                        maxWidth: 400,
                        textAlign: 'center',
                        boxShadow: 6,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        {message}
                    </Typography>
                    <Button
                        variant="contained"
                        color="inherit"
                        sx={{ color: '#f44336', backgroundColor: '#fff' }}
                        onClick={handleClose} // Aquí el cierre correcto
                    >
                        Ir a Login
                    </Button>
                </Box>
            </Box>
        );
    }

    if (type === 'popup') {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 16,
                    right: 16,
                    zIndex: 9999,
                    width: { xs: '90%', sm: 'auto' },
                }}
            >
                <Alert severity={severity}>{message}</Alert>
            </Box>
        );
    }

    return null;
}
