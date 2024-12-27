import React, { useState } from 'react';
import { db, auth } from './firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const MaterialConsumption = ({ materials, products }) => {
  const [consumptionData, setConsumptionData] = useState({});

  const handleConsumptionChange = (materialId, field, value) => {
    const parsedValue = parseFloat(value);
    const roundedValue = field === 'quantity' && !isNaN(parsedValue)
      ? parseFloat(parsedValue.toFixed(2)) // Limitar a dos decimales
      : value;

    setConsumptionData((prevData) => ({
      ...prevData,
      [materialId]: {
        ...prevData[materialId],
        [field]: roundedValue,
      },
    }));
  };

  const handleSaveConsumption = async (materialId) => {
    const data = consumptionData[materialId];
    if (!data || !data.quantity || !data.productId) {
      alert('Por favor, llena todos los campos.');
      return;
    }

    const consumedQuantity = parseFloat(data.quantity);
    if (isNaN(consumedQuantity) || consumedQuantity <= 0) {
      alert('Introduce una cantidad válida.');
      return;
    }

    const material = materials.find((mat) => mat.id === materialId);
    const newQuantity = material.quantity - consumedQuantity;

    if (newQuantity < 0) {
      alert('No hay suficiente material en el inventario.');
      return;
    }

    try {
      // Registrar el consumo en el historial
      await addDoc(collection(db, 'historial'), {
        materialId,
        previousQuantity: material.quantity,
        newQuantity,
        productId: data.productId,
        tipoMovimiento: 'Consumo',
        consumo: consumedQuantity,
        modifiedBy: auth.currentUser ? auth.currentUser.email : 'Anónimo',
        timestamp: serverTimestamp(),
      });

      // Actualizar la cantidad en la colección 'materials'
      const materialDoc = doc(db, 'materials', materialId);
      await updateDoc(materialDoc, { quantity: newQuantity });

      alert('Consumo registrado correctamente.');
      setConsumptionData((prevData) => ({ ...prevData, [materialId]: {} }));
    } catch (error) {
      console.error('Error registrando el consumo:', error);
      alert('Hubo un error al registrar el consumo.');
    }
  };

  return (
    <div>
      <h2>Consumo de Materiales</h2>
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Cantidad Actual</th>
            <th>Producto Asociado</th>
            <th>Cantidad Consumida</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.id}>
              <td>{material.name}</td>
              <td>{material.quantity}</td>
              <td>
                <select
                  value={consumptionData[material.id]?.productId || ''}
                  onChange={(e) =>
                    handleConsumptionChange(material.id, 'productId', e.target.value)
                  }
                >
                  <option value="">Selecciona un producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  step="any"
                  value={consumptionData[material.id]?.quantity || ''}
                  onChange={(e) =>
                    handleConsumptionChange(material.id, 'quantity', e.target.value)
                  }
                  placeholder="Cantidad"
                />
              </td>
              <td>
                <button onClick={() => handleSaveConsumption(material.id)}>
                  Guardar Consumo
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialConsumption;
