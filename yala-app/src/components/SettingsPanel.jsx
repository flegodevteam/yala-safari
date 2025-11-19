import React, { useState } from "react";
import { FiSettings, FiBell, FiGlobe, FiMoon, FiSun } from "react-icons/fi";

const SettingsPanel = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-2 flex items-center gap-3">
          <FiSettings className="w-8 h-8" />
          Settings Panel
        </h2>
        <p className="text-[#6b7280] text-base">Manage your dashboard preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8">
          <h3 className="text-xl font-bold text-[#034123] mb-6 flex items-center gap-2">
            <FiSun className="w-5 h-5" />
            Appearance
          </h3>
          <div className="space-y-5">
            <label className="flex items-center justify-between p-4 bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60 cursor-pointer hover:bg-[#f9fafb] transition-all duration-300 group">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <FiMoon className="w-5 h-5 text-[#034123] group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <FiSun className="w-5 h-5 text-[#034123] group-hover:scale-110 transition-transform duration-300" />
                )}
                <span className="font-semibold text-[#034123]">Dark Mode</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="sr-only"
                />
                <div className={`w-14 h-7 rounded-full transition-all duration-300 ${
                  darkMode ? 'bg-[#034123]' : 'bg-[#d1d5db]'
                }`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
                    darkMode ? 'translate-x-7' : 'translate-x-0.5'
                  } mt-0.5`}></div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8">
          <h3 className="text-xl font-bold text-[#034123] mb-6 flex items-center gap-2">
            <FiBell className="w-5 h-5" />
            Notifications
          </h3>
          <div className="space-y-5">
            <label className="flex items-center justify-between p-4 bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60 cursor-pointer hover:bg-[#f9fafb] transition-all duration-300 group">
              <div className="flex items-center gap-3">
                <FiBell className="w-5 h-5 text-[#034123] group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold text-[#034123]">Enable Notifications</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="sr-only"
                />
                <div className={`w-14 h-7 rounded-full transition-all duration-300 ${
                  notifications ? 'bg-[#034123]' : 'bg-[#d1d5db]'
                }`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
                    notifications ? 'translate-x-7' : 'translate-x-0.5'
                  } mt-0.5`}></div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8 lg:col-span-2">
          <h3 className="text-xl font-bold text-[#034123] mb-6 flex items-center gap-2">
            <FiGlobe className="w-5 h-5" />
            Language Preferences
          </h3>
          <div className="space-y-5">
            <label className="block">
              <span className="block text-sm font-semibold text-[#034123] mb-3">Select Language</span>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="si">Sinhala</option>
                <option value="ta">Tamil</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-[#034123] hover:bg-[#026042] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
          Save Settings
        </button>
      </div>
    </div>
  );
};
  
export default SettingsPanel;