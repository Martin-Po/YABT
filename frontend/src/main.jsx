import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AlertProvider } from './context/AlertContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AlertProvider>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </AlertProvider>
  </React.StrictMode>,
)
