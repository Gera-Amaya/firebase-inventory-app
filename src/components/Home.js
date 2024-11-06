import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Sistema de Control de Inventarios</h1>
        <p>Gestiona los materiales termoencogibles PROTERMO.</p>
        <div className="home-buttons">
          <Link to="/inventario" className="home-link">
            Ir al Inventario
          </Link>
          <Link to="/reportes" className="home-link">
            Ver Reportes
          </Link>
          <Link to="/historial" className="home-link">
            Historial
          </Link>
        </div>
      </header>
      <section className="home-info">
        <ul>
          <li>Revisa el inventario de materiales.</li>
          <li>Genera reportes personalizados sobre el uso de materiales.</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
