// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/">PROTERMO</Link></li>
        <li><Link to="/inventario">Inventario</Link></li>
        <li><Link to="/adminInventario">Actualizar inventario</Link></li>
        <li><Link to="/ingresoMaterial">Ingesar material</Link></li>
        <li><Link to="/historial">Historial</Link></li>
        <li><Link to="/reportes">Reportes</Link></li>
        <li><Link to="/ajustes">Ajustes</Link></li>
      </ul>
      <div className="logout-container">
        {/* Solo mostrar el botón de cerrar sesión si el usuario está autenticado */}
        {isAuthenticated && (
          <button className="logout-button" onClick={onLogout}>
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
