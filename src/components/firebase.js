// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";  // Importar la autenticación
import { getFirestore } from 'firebase/firestore';







// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAFKHoq41BhIkhoflnR3cQVvjwVneZVXY4",
    authDomain: "inventario-termo.firebaseapp.com",
    projectId: "inventario-termo",
    storageBucket: "inventario-termo.appspot.com",
    messagingSenderId: "786957859374",
    appId: "1:786957859374:web:41984dadd806df50a6bdbf",
    measurementId: "G-1R4NHG99R1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa la autenticación
const db = getFirestore(app);
// Inicializar y exportar la autenticación

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Aquí puedes inicializar la autenticación
  })
  .catch((error) => {
    console.error('Error al establecer la persistencia:', error);
  });


export { db, auth };
