import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Inventario from './components/Inventario';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Ajustes from './components/Ajustes';
import Historial from './components/Historial';
import Reportes from './components/Reportes';
import AdminInventario from './components/AdminInventario';
import IngresoMaterial from './components/IngresoMaterial';
import { auth } from './components/firebase'; // Asegúrate de importar auth

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para manejar el tiempo de espera

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    auth.signOut(); // Cierra la sesión en Firebase
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Verifica si hay un usuario autenticado
      setLoading(false); // Cambia el estado de carga cuando Firebase verifica la autenticación
    });

    return () => unsubscribe(); // Limpia el listener cuando se desmonta el componente
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Opcional: muestra un mensaje de carga mientras Firebase verifica la autenticación
  }

  return (
    <div className="App">
      
      {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login onLogin={handleLogin} />} />
        <Route path="/inventario" element={isAuthenticated ? <Inventario /> : <Navigate to="/" />} />
        <Route path="/ajustes" element={isAuthenticated ? <Ajustes /> : <Navigate to="/" />} />
        <Route path="/historial" element={isAuthenticated ? <Historial /> : <Navigate to="/" />} />
        <Route path="/reportes" element={isAuthenticated ? <Reportes /> : <Navigate to="/" />} />
        <Route path="/adminInventario" element={isAuthenticated ? <AdminInventario /> : <Navigate to="/" />} />
        <Route path="/ingresoMaterial" element={isAuthenticated ? <IngresoMaterial /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
