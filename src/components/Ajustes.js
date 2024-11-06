import React, { useState } from 'react';

const Settings = () => {
  const [language, setLanguage] = useState('es');
  const [darkMode, setDarkMode] = useState(false);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="settings-container">
      <h1>Ajustes</h1>

      <div className="settings-option">
        <label htmlFor="language">Selecciona el idioma:</label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>
      </div>

      <div className="settings-option">
        <label htmlFor="dark-mode">Modo Oscuro:</label>
        <input
          type="checkbox"
          id="dark-mode"
          checked={darkMode}
          onChange={handleDarkModeToggle}
        />
        <span>{darkMode ? 'Activado' : 'Desactivado'}</span>
      </div>
    </div>
  );
};

export default Settings;
