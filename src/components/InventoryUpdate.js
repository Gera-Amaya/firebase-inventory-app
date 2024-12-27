import React, { useState } from 'react';
import { db, auth } from './firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const InventoryUpdate = ({ materials }) => {
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInventoryUpdate = async (id) => {
    const material = materials.find((mat) => mat.id === id);
    const inputQuantity = parseFloat(updatedQuantities[id]);

    if (isNaN(inputQuantity) || inputQuantity < 0) {
      alert('Introduce una cantidad válida (mayor o igual a 0).');
      return;
    }

    const roundedQuantity = parseFloat(inputQuantity.toFixed(2));
    const consumption = material.quantity - roundedQuantity;

    try {
      const materialDoc = doc(db, 'materials', id);

      // Registrar movimiento en el historial
      await addDoc(collection(db, 'historial'), {
        materialId: id,
        previousQuantity: material.quantity,
        newQuantity: roundedQuantity,
        consumo: consumption > 0 ? consumption : null,
        ingreso: consumption < 0 ? Math.abs(consumption) : null,
        tipoMovimiento: consumption > 0 ? 'Consumo' : 'Ingreso',
        modifiedBy: auth.currentUser ? auth.currentUser.email : 'Anónimo',
        timestamp: serverTimestamp(),
      });

      // Actualizar cantidad en 'materials'
      await updateDoc(materialDoc, { quantity: roundedQuantity });

      alert(`Inventario de ${material.name} actualizado correctamente.`);
      setUpdatedQuantities((prevState) => ({ ...prevState, [id]: '' }));
    } catch (error) {
      console.error('Error actualizando el inventario:', error);
      alert('Hubo un error al actualizar el inventario.');
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);

    for (const id of Object.keys(updatedQuantities)) {
      if (updatedQuantities[id]) {
        await handleInventoryUpdate(id);
      }
    }

    setIsSaving(false);
    alert('Todos los cambios se han guardado.');
  };

  return (
    <div>
      <h2>Actualizar Inventario</h2>
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Cantidad Actual</th>
            <th>Nueva Cantidad</th>
            <th>Acciones</th>
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
                  step="0.01"
                  value={updatedQuantities[material.id] || ''}
                  onChange={(e) =>
                    setUpdatedQuantities((prevState) => ({
                      ...prevState,
                      [material.id]: e.target.value,
                    }))
                  }
                  placeholder="Nueva cantidad"
                />
              </td>
              <td>
                <button
                  onClick={() => handleInventoryUpdate(material.id)}
                  disabled={!updatedQuantities[material.id]}
                >
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSaveAll} disabled={isSaving || Object.keys(updatedQuantities).length === 0}>
        {isSaving ? 'Guardando...' : 'Guardar Todo'}
      </button>
    </div>
  );
};

export default InventoryUpdate;
