// src/components/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importar la función de autenticación
import { auth } from './firebase'; // Importar la configuración de Firebase
import '../styles/Login.css';
import logopt from '../assets/logopt.png';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState(''); // Cambié username a email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Usar Firebase Auth para el inicio de sesión
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuario autenticado:', user);
        onLogin(); // Llama a la función onLogin después de autenticarse
        // Redirige o realiza la acción que desees después del inicio de sesión
      })
      .catch((error) => {
        console.error('Error en el inicio de sesión:', error.message);
        setError('Credenciales incorrectas.'); // Mostrar error
      });
  };

  return (
    <div className="login-container">
      <img src={logopt} alt="logopt" className="login-logo" />
      <h1>Iniciar Sesión</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar el mensaje de error */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo Electrónico:</label> {/* Cambié username a email */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
