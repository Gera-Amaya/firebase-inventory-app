import React from 'react';
import ReactDOM from 'react-dom/client';  // Importación correcta para React 18
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // Cambiar a createRoot

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Si deseas medir el rendimiento de la aplicación, puedes pasar una función
// para registrar resultados (por ejemplo: reportWebVitals(console.log))
// o enviarlos a un punto final de análisis. Aprende más: https://bit.ly/CRA-vitals
reportWebVitals();
