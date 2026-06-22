import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// ==================== MOCKS PRIMERO (IMPORTANTE) ====================
const mockLogin = jest.fn();

jest.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

jest.mock('../utils/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }
}));

import LoginForm from '../components/LoginForm';

const user = userEvent.setup();

describe('LoginForm - Análisis de Comportamiento (Cap. 3)', () => {
  
  beforeEach(() => {
    mockLogin.mockClear();
  });

  test('debe cumplir con la accesibilidad básica (labels presentes)', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  test('debe permitir la entrada de datos (Estado manejado correctamente)', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const userInput = screen.getByLabelText(/usuario/i);
    const passInput = screen.getByLabelText(/contraseña/i);

    fireEvent.change(userInput, { target: { value: 'martin_user' } });
    fireEvent.change(passInput, { target: { value: 'password123' } });

    expect(userInput.value).toBe('martin_user');
    expect(passInput.value).toBe('password123');
  });

  test('debe ejecutar el proceso de login al enviar el formulario', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const userInput = screen.getByLabelText(/usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await user.type(userInput, 'admin');
    await user.type(passwordInput, 'admin123');

    const submitButton = screen.getByRole('button', { name: /ingresar/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'admin',
        password: 'admin123'
      });
    });
  });

  test('debe mostrar una alerta si las credenciales fallan', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Credenciales inválidas');
    });

    alertSpy.mockRestore();
  });
});