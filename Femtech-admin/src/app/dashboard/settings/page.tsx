'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'MamaTokens',
    supportEmail: 'support@mamatokens.com',
    minRedemption: 50,
    maxMintPerDay: 500,
    otpExpiry: 10,
    sessionTimeout: 7,
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-700">Configure system settings and parameters</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Token Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Minimum Redemption (MAMA)</label>
            <input
              type="number"
              value={settings.minRedemption}
              onChange={(e) => setSettings({ ...settings, minRedemption: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Max Mint Per Day (MAMA)</label>
            <input
              type="number"
              value={settings.maxMintPerDay}
              onChange={(e) => setSettings({ ...settings, maxMintPerDay: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">OTP Expiry (minutes)</label>
            <input
              type="number"
              value={settings.otpExpiry}
              onChange={(e) => setSettings({ ...settings, otpExpiry: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Session Timeout (days)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="w-5 h-5 text-pink-600 rounded" />
            <span className="text-gray-800">Email notifications for new users</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="w-5 h-5 text-pink-600 rounded" />
            <span className="text-gray-800">Email notifications for redemptions</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5 text-pink-600 rounded" />
            <span className="text-gray-800">SMS notifications for high-value transactions</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
