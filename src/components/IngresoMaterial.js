import React, { useEffect, useState } from 'react';
import { db } from '../components/firebase';
import { collection, getDocs } from 'firebase/firestore';
import InventoryArrival from './InventoryArrival.js';

const AdminInventario = () => {
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

  return (
    <div>
      <h1>Administración de Inventario</h1>
      <InventoryArrival materials={materials} />
    </div>
  );
};

export default AdminInventario;