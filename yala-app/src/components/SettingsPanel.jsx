import React, { useState } from "react";

const SettingsPanel = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div style={{ padding: "1rem", maxWidth: 400 }}>
      <h2>Settings Panel</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Dark Mode
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          Enable Notifications
        </label>
      </div>
      <div>
        <label>
          Language:
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </label>
      </div>
    </div>
  );
};
  
  export default SettingsPanel;