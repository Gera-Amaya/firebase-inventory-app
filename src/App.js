import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Inventario from './components/Inventario';
import Navbar from './components/Navbar';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard'; // Crear un componente para admin
import Ajustes from './components/Ajustes';
import Historial from './components/Historial';
import Reportes from './components/Reportes';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (adminStatus) => {
    setIsAuthenticated(true);
    setIsAdmin(adminStatus); // Establecer si el usuario es administrador
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false); // Reseteamos el estado de admin al hacer logout
  };

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login onLogin={handleLogin} />} />
        <Route path="/inventario" element={isAuthenticated ? <Inventario /> : <Navigate to="/" />} />
        <Route path="/ajustes" element={isAuthenticated ? <Ajustes /> : <Navigate to="/" />} />
        <Route path="/historial" element={isAuthenticated ? <Historial /> : <Navigate to="/" />} />
        <Route path="/reportes" element={isAuthenticated ? <Reportes /> : <Navigate to="/" />} />
        <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
