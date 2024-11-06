import React, { useEffect, useState } from 'react';
import { db } from '../components/firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/Inventarios.css';

const Inventario = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      const materialsCollection = collection(db, 'materials');
      const materialSnapshot = await getDocs(materialsCollection);
      const materialList = materialSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(materialList);
    };

    fetchMaterials();
  }, []);

  // Función para determinar el estado del inventario
  const getInventoryStatus = (quantity, minLevel, maxLevel, reorderLevel) => {
    if (quantity <= minLevel) {
      return "Mínimo";
    } else if (quantity <= reorderLevel) {
      return "Punto de Reorden";
    } else if (quantity >= maxLevel) {
      return "Máximo";
    } else {
      return "OK";
    }
  };

  const getInventoryStatusClass = (quantity, minLevel, maxLevel, reorderLevel) => {
    if (quantity <= minLevel) return "status-min";
    if (quantity <= reorderLevel) return "status-reorder";
    if (quantity >= maxLevel) return "status-max";
    return "status-ok";
  };
  

  return (
    <div>
      <h1>Inventario de Materiales</h1>
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(material => (
            <tr key={material.id}>
              <td>{material.name}</td>
              <td>{material.quantity}</td>
              <td>{material.quantity > 1000 ? 'Kg' : 'Kg'}</td>
              <td className={getInventoryStatusClass(material.quantity, material.minLevel, material.maxLevel, material.reorderLevel)}>
                {getInventoryStatus(material.quantity, material.minLevel, material.maxLevel, material.reorderLevel)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventario;
