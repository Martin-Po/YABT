import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import { TextField, Button } from '@mui/material'
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { logger } from '../utils/logger.js';

export default function LoginForm() {
  const { login } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    const { username, password } = Object.fromEntries(new FormData(e.currentTarget));
    try {
      logger.debug('Probando')
      await login({ username, password })
      navigate('/')
    } catch {
      
      alert('Credenciales inválidas')
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#f3f4f6',
        height: '100vh',
        width: '100vw',
        position: 'relative',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    >

      <Container component="main" maxWidth="xs" sx={{ backgroundColor: 'white', borderRadius: 2, padding: 3 }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1,  }}>
            <LockOutlinedIcon />
          </Avatar>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} data-testid="login-form">
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: 'white' }}
            >
              Ingresar
            </Button>

          </Box>
        </Box>
      </Container>
    </div>
  )
}