import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import '../styles/Reportes.css';

function Reportes() {
  const [materials, setMaterials] = useState([]); // Lista de materiales
  const [defaultReportData, setDefaultReportData] = useState([]); // Consumo mensual predeterminado
  const [selectedMaterial, setSelectedMaterial] = useState(''); // Material seleccionado
  const [startDate, setStartDate] = useState(''); // Fecha inicio
  const [endDate, setEndDate] = useState(''); // Fecha fin
  const [reportData, setReportData] = useState([]); // Datos del reporte buscado

  // Obtener materiales desde Firestore al cargar el componente
  useEffect(() => {
    const fetchMaterials = async () => {
      const materialsCollection = collection(db, 'materials');
      const snapshot = await getDocs(materialsCollection);
      const materialsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(materialsList);
    };

    fetchMaterials();
    generateDefaultReport(); // Generar reporte del mes actual al cargar
  }, []);

  // Generar reporte mensual predeterminado (consumo por material)
  const generateDefaultReport = async () => {
    try {
      const historialCollection = collection(db, 'historial');
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Primer día del mes
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último día del mes

      // Query para obtener solo consumos del mes actual
      const q = query(
        historialCollection,
        where('tipoMovimiento', '==', 'Consumo'),
        where('timestamp', '>=', startOfMonth),
        where('timestamp', '<=', endOfMonth)
      );

      const snapshot = await getDocs(q);
      const report = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Agrupar consumos por material
      const groupedReport = report.reduce((acc, entry) => {
        const materialId = entry.materialId;
        if (!acc[materialId]) {
          acc[materialId] = {
            materialName: entry.materialName,
            totalConsumido: 0,
          };
        }
        acc[materialId].totalConsumido += entry.consumo || 0; // Sumar consumo
        return acc;
      }, {});

      setDefaultReportData(Object.values(groupedReport)); // Convertir objeto a array
    } catch (error) {
      console.error('Error generando reporte mensual:', error);
      alert('Hubo un problema al cargar el consumo mensual.');
    }
  };

  // Generar reporte buscado por fechas y material
  const generateReport = async () => {
    if (!selectedMaterial) {
      alert('Selecciona un material.');
      return;
    }
    if (!startDate || !endDate) {
      alert('Selecciona un rango de fechas.');
      return;
    }
  
    try {
      const historialCollection = collection(db, 'historial');
      const q = query(
        historialCollection,
        where('materialId', '==', selectedMaterial),
        where('tipoMovimiento', '==', 'Consumo'), // Filtrar solo consumos
        where('timestamp', '>=', new Date(startDate)),
        where('timestamp', '<=', new Date(endDate))
      );
  
      const snapshot = await getDocs(q);
      const report = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setReportData(report);
    } catch (error) {
      if (error.code === 'failed-precondition') {
        console.error('Error de índice:', error);
        alert(
          'La consulta requiere un índice. Por favor, crea el índice en Firebase Console según el enlace proporcionado.'
        );
      } else {
        console.error('Error generando reporte:', error);
        alert('Hubo un problema al generar el reporte.');
      }
    }
  };

  return (
    <div className="reportes-container">
      <header className="reportes-header">
        <h1>Reporte de Consumo de Materiales</h1>
        <p>Consulta el consumo mensual predeterminado o realiza una búsqueda específica.</p>
      </header>

      {/* Consumo mensual predeterminado */}
      <section className="reportes-default">
        <h2>Consumo Mensual (Mes Actual)</h2>
        {defaultReportData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Total Consumido</th>
              </tr>
            </thead>
            <tbody>
              {defaultReportData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.materialName}</td>
                  <td>{entry.totalConsumido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay consumos registrados para este mes.</p>
        )}
      </section>

      {/* Buscador de consumo */}
      <section className="reportes-controls">
        <h2>Búsqueda Específica</h2>
        <div>
          <label htmlFor="material">Material:</label>
          <select
            id="material"
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="">Selecciona un material</option>
            {materials.map(material => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate">Fecha inicio:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="endDate">Fecha fin:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button onClick={generateReport}>Generar Reporte</button>
      </section>

      <section className="reportes-content">
        <h2>Resultados de la Búsqueda</h2>
        {reportData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Consumo</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(entry => (
                <tr key={entry.id}>
                  <td>{new Date(entry.timestamp.toDate()).toLocaleString()}</td>
                  <td>{entry.consumo || 'No disponible'}</td>
                  <td>{entry.modifiedBy || 'Desconocido'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay datos para mostrar en este rango de fechas.</p>
        )}
      </section>
    </div>
  );
}

export default Reportes;
