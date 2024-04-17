import React from 'react'
import Login from './components/Login'
import backgroundImage from './assets/COVER_IMAGE.jfif'; 
import {Route, Routes} from 'react-router-dom'
import Register from './components/Register'


const App = () => {
  return (
    <>
    
    <div className='text-white h-[100vh] flex justify-center items-center bg-cover' style={{ backgroundImage: `url(${backgroundImage})`  }}>
        <Routes>
          <Route path='/' element={ <Login />}/>
          <Route path='register' element={ <Register />}/>
        </Routes>
    </div>
    </>
      

    
  )
}

export default App