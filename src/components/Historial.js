import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const q = query(collection(db, 'historial'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      setHistory(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Historial de Movimientos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Material</th>
            <th>Cantidad Anterior</th>
            <th>Cantidad Nueva</th>
            <th>Consumo</th>
            <th>Movimiento</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.materialId}</td>
              <td>{entry.materialName}</td>
              <td>{entry.previousQuantity}</td>
              <td>{entry.newQuantity}</td>
              <td>{entry.consumo || 'N/A'}</td>
              <td>{entry.tipoMovimiento}</td>
              <td>
                {entry.timestamp?.toDate().toLocaleString() || 'Sin Fecha'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
