import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Games from './pages/Games';
import Teams from './pages/Teams';
import Players from './pages/Players';

import ProtectedRoute from './components/ui/ProtectedRoute';
import UserDashboard from './pages/UserDashboard';
import UserGames from './pages/UserGames';
import UserTeams from './pages/UserTeams';
import UserEditPlayer from './pages/UserEditPlayer';


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/Login' />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Register' element={<Register />} />
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path='/Home' element={<Home />} />
        <Route path='/Games' element={<Games />} />
        <Route path='/Teams' element={<Teams />} />
        <Route path='/Players' element={<Players />} />
      
      </Route>
      <Route element={<ProtectedRoute role="user" />}>
        <Route path='/UserDashboard/:userId' element={<UserDashboard />}>
          <Route path='Games' element={<UserGames />} />
          <Route path='Teams' element={<UserTeams />} />
          <Route path='EditPlayer' element={<UserEditPlayer />} />
        
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
