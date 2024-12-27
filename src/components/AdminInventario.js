import React, { useEffect, useState } from 'react';
import { db, auth } from '../components/firebase';
import { collection, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import '../styles/AdminInventario.css';

const AdminInventario = () => {
  const [materials, setMaterials] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({}); // Estado para las cantidades ingresadas
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      const materialsCollection = collection(db, 'materials');
      const materialSnapshot = await getDocs(materialsCollection);
      const materialList = materialSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMaterials(materialList);

      // Inicializar updatedQuantities con las cantidades actuales de cada material
      const initialQuantities = materialList.reduce((acc, material) => {
        acc[material.id] = material.quantity || '';
        return acc;
      }, {});
      setUpdatedQuantities(initialQuantities);
    };

    fetchMaterials();
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    // Validar y actualizar las cantidades ingresadas
    const updatedValue = newQuantity === '' ? '' : parseFloat(newQuantity) || '';
    setUpdatedQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: updatedValue,
    }));
  };

  const handleUpdateAll = async () => {
    setIsLoading(true);

    try {
      const updatePromises = materials.map(async (material) => {
        const materialRef = doc(db, 'materials', material.id);
        const newQuantity = updatedQuantities[material.id];

        // Verificar si hay una cantidad nueva válida
        if (newQuantity === '' || isNaN(newQuantity)) return;

        const consumption = material.quantity - newQuantity;

        // Registrar tanto consumos como ingresos en el historial
        await addDoc(collection(db, 'historial'), {
          materialId: material.id,
          previousQuantity: material.quantity,
          newQuantity: newQuantity,
          tipoMovimiento: consumption > 0 ? 'Consumo' : 'Ingreso',
          consumo: consumption > 0 ? consumption : null,
          ingreso: consumption < 0 ? Math.abs(consumption) : null,
          modifiedBy: auth.currentUser ? auth.currentUser.email : 'Anónimo',
          timestamp: serverTimestamp(),
        });

        // Actualizar la cantidad en el inventario
        return updateDoc(materialRef, { quantity: newQuantity });
      });

      await Promise.all(updatePromises);
      alert('Inventario actualizado correctamente.');
      setUpdatedQuantities({});
    } catch (error) {
      console.error('Error al actualizar el inventario:', error);
      alert('Hubo un error al actualizar el inventario.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si todas las casillas están vacías
  const isButtonDisabled = Object.values(updatedQuantities).every(value => value === '');

  return (
    <div className="admin-inventario-container">
      <h1>Actualizar Inventario</h1>
      <table className="admin-inventario-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Cantidad Actual</th>
            <th>Nueva Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(material => (
            <tr key={material.id}>
              <td>{material.name}</td>
              <td>{material.quantity}</td>
              <td>
                <input
                  type="number"
                  step="0.01" // Permitir decimales
                  value={updatedQuantities[material.id] || ''} // Asegurarse de que se muestre el valor actualizado
                  onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                  placeholder="Nueva cantidad"
                  min="0"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="admin-inventario-button"
        onClick={handleUpdateAll}
        disabled={isLoading || isButtonDisabled}
      >
        {isLoading ? 'Actualizando...' : 'Cargar Inventario'}
      </button>
    </div>
  );
};

export default AdminInventario;
