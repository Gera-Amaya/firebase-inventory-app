import React from 'react';
import '../styles/Reportes.css'; // Importa el archivo de estilos

function Reportes() {
  return (
    <div className="reportes-container">
      <header className="reportes-header">
        <h1>Reportes del Sistema de Inventarios</h1>
        <p>Aquí puedes visualizar los reportes generados sobre el uso de los materiales termoencogibles.</p>
      </header>
      <section className="reportes-content">
        <div className="report">
          <h2>Reporte Semanal</h2>
          <p>Este reporte muestra el consumo de materiales durante la última semana.</p>
          <button>Ver Detalles</button>
        </div>
        <div className="report">
          <h2>Reporte Mensual</h2>
          <p>Este reporte contiene un análisis detallado del uso de materiales durante el mes.</p>
          <button>Ver Detalles</button>
        </div>
        <div className="report">
          <h2>Reporte Personalizado</h2>
          <p>Genera un reporte personalizado seleccionando el rango de fechas y otros parámetros.</p>
          <button>Generar Reporte</button>
        </div>
      </section>
    </div>
  );
}

export default Reportes;
