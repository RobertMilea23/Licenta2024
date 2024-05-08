import React from 'react'
import Login from './pages/Login'
import backgroundImage from './assets/COVER_IMAGE.jfif'; 
import {Route, Routes} from 'react-router-dom'
import Register from './pages/Register'
import { Navigate } from 'react-router-dom';
import Home from './pages/Home'
import Games from './pages/Games'


const App = () => {


  return (
    <>
   
   <Routes>
        <Route path='/' element={<Navigate to='/Login' />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/Games' element={<Games />} />
      </Routes>

   
      
      
    
        
      
    </>
  )
}

export default App