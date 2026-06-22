import { useEffect, useState } from 'react'
import './App.css'
import Home from './components/Home'
import LoginForm from './components/LoginForm'
import { useAuth } from './context/AuthContext'
import { Route, Routes } from 'react-router-dom'
import { PrivateRoutes } from './components/PrivateRoutes'
import { AlertBox } from './utils/AlertBox'
import { useAlert } from './context/AlertContext'



function App() {

  const {user} = useAuth()
  const [count, setCount] = useState(0)
  const { alert, hideAlert } = useAlert();

  useEffect(() => {
    if (!user) {
      // No hay usuario, no hacemos nada
    } else {
      const stored = JSON.parse(localStorage.getItem('loggedUser'))
      const token  = stored?.token

    }
}, [user])


  return (
    <div>
       <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/*" element={<Home />} />          
      </Route>  
    </Routes>
     {alert && (
        <AlertBox
          message={alert.message}
          type={alert.type}
          severity={alert.severity}
          onClose={hideAlert}  
          error ={alert.error}      />
      )}

    </div>   
  )
}

export default App
