import React, { useState } from 'react';
import { db, auth } from './firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const InventoryArrival = ({ materials }) => {
  const [newArrivalQuantities, setNewArrivalQuantities] = useState({});

  const handleQuantityChange = (id, quantity) => {
    // Convertir a número con máximo dos decimales
    const value = parseFloat(quantity);
    const roundedValue = !isNaN(value) ? parseFloat(value.toFixed(2)) : 0;

    setNewArrivalQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: roundedValue,
    }));
  };

  const handleSaveAll = async () => {
    try {
      const updatePromises = materials.map(async (material) => {
        const addedQuantity = newArrivalQuantities[material.id] || 0;

        if (addedQuantity > 0) {
          const newTotalQuantity = Number(material.quantity) + addedQuantity;

          // Guardar en historial
          await addDoc(collection(db, 'historial'), {
            materialName: material.name,
            materialId: material.id,
            previousQuantity: material.quantity,
            newQuantity: newTotalQuantity,
            tipoMovimiento: 'Ingreso de material',
            consumo: null,
            modifiedBy: auth.currentUser ? auth.currentUser.email : 'Anónimo',
            timestamp: serverTimestamp(),
          });

          // Actualizar cantidad en materials
          const materialDoc = doc(db, 'materials', material.id);
          await updateDoc(materialDoc, {
            quantity: newTotalQuantity,
          });
        }
      });

      // Esperar a que todas las actualizaciones se completen
      await Promise.all(updatePromises);
      alert('Materiales actualizados correctamente.');

      // Limpiar cantidades ingresadas y actualizar lista de materiales
      setNewArrivalQuantities({});
    } catch (error) {
      console.error('Error al actualizar materiales:', error);
      alert('Hubo un error al guardar el inventario.');
    }
  };

  return (
    <div>
      <h2>Ingreso de Nuevo Material</h2>
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Cantidad Actual</th>
            <th>Cantidad Ingresada</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.id}>
              <td>{material.name}</td>
              <td>{material.quantity}</td>
              <td>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={newArrivalQuantities[material.id] || ''}
                  onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                  placeholder="Cantidad a ingresar"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="admin-inventario" onClick={handleSaveAll}>
        Guardar
      </button>
    </div>
  );
};

export default InventoryArrival;
