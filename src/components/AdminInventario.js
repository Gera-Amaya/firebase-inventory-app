import React, { useEffect, useState } from 'react';
import { db } from '../components/firebase';
import { collection, getDocs, updateDoc, doc, addDoc, Timestamp } from 'firebase/firestore';
import '../styles/Inventarios.css';

const AdminInventario = ({ isAdmin }) => {
  const [materials, setMaterials] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);

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

  const handleEdit = (material) => {
    setEditMode(material.id);
    setEditQuantity(material.quantity);
  };

  const handleSave = async (material) => {
    const materialRef = doc(db, 'materials', material.id);
    await updateDoc(materialRef, { quantity: editQuantity });

    // Log the change in the consumptionHistory collection
    await addDoc(collection(db, 'consumptionHistory'), {
      materialId: material.id,
      quantity: editQuantity - material.quantity,
      type: editQuantity > material.quantity ? 'entrada' : 'salida',
      timestamp: Timestamp.now(),
      userId: 'adminUserId', // Replace with the actual admin user ID
    });

    setMaterials(materials.map(mat => mat.id === material.id ? { ...mat, quantity: editQuantity } : mat));
    setEditMode(null);
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  return (
    <div>
      <h1>Admin: Inventario de Materiales</h1>
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Estado</th>
            {isAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {materials.map(material => (
            <tr key={material.id}>
              <td>{material.name}</td>
              <td>
                {editMode === material.id ? (
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(parseInt(e.target.value))}
                  />
                ) : (
                  material.quantity
                )}
              </td>
              <td>{material.quantity > 1000 ? 'Kg' : 'Kg'}</td>
              <td>{getInventoryStatus(material)}</td>
              {isAdmin && (
                <td>
                  {editMode === material.id ? (
                    <>
                      <button onClick={() => handleSave(material)}>Guardar</button>
                      <button onClick={handleCancel}>Cancelar</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(material)}>Editar</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getInventoryStatus = (material) => {
  if (material.quantity <= material.minQuantity) return 'Min';
  if (material.quantity <= material.reorderLevel) return 'Reorder';
  if (material.quantity >= material.maxQuantity) return 'Max';
  return 'Ok';
};

export default AdminInventario;
