import { Box, Alert, Typography, Button } from '@mui/material';
import { createContext, useContext, useState } from 'react';
import { logger } from '../utils/logger';

const AlertContext = createContext();

export function AlertProvider({ children }) {
    const [alert, setAlert] = useState(null);

    const showAlert = ({message, type = 'popup', severity = 'info', duration = 2000, error}) => {

    if (error)
    {    
        message = error.response !== undefined
          ? error.response?.data?.error || error.message
          : error.message;
    }

        setAlert({ message, type, severity, error });
        if ((typeof duration === 'number' && duration > 0) && message !== 'token expired') {
        setTimeout(() => setAlert(null), duration);
    }
    };

    const hideAlert = () => setAlert(null);

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
            {children}            
        </AlertContext.Provider>
    );
}

export const useAlert = () => useContext(AlertContext);

// Alert component + CSS (todo junto)
