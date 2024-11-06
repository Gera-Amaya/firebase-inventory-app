import React from 'react';
import '../styles/Historial.css'

function Historial() {
  return (
    <div className="historial-container">
      <header className="historial-header">
        <h1>Historial de Actividades</h1>
        <p>Aquí puedes ver el historial del inventario.</p>
      </header>
      <section className="historial-content">
        <h2>Registro de Cambios</h2>
        <ul>
          <li>Cambio de stock - Se recibe material: xx unidades (Fecha)</li>
          <li>Consumo de material - Producto B (Fecha)</li>
          <li>Actualizacion de inventario (21/10/24)</li>
          {/* Agrega más elementos según sea necesario */}
        </ul>
      </section>
    </div>
  );
}

export default Historial;
