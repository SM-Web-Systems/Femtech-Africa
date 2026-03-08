'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'viewer';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'admin' });
  const [saving, setSaving] = useState(false);

  const API_URL = 'https://api.mamatokens.com/api/v1';

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  };

  const fetchAdmins = async () => {
    try {
      const token = getToken();
      if (!token) {
        router.push('/');
        return;
      }

      const [adminsRes, meRes] = await Promise.all([
        fetch(`${API_URL}/admin/admins`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/me`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (adminsRes.status === 403) {
        setError('You need super admin privileges to manage admins');
        setLoading(false);
        return;
      }

      if (!adminsRes.ok || !meRes.ok) throw new Error('Failed to fetch data');

      const adminsData = await adminsRes.json();
      const meData = await meRes.json();

      setAdmins(adminsData);
      setCurrentAdmin(meData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/admin/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create admin');
      }

      setShowAddModal(false);
      setFormData({ email: '', password: '', name: '', role: 'admin' });
      fetchAdmins();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setSaving(true);
    try {
      const token = getToken();
      const updateData: any = { name: formData.name, role: formData.role };
      if (formData.password) updateData.password = formData.password;

      const res = await fetch(`${API_URL}/admin/admins/${editingAdmin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update admin');
      }

      setShowEditModal(false);
      setEditingAdmin(null);
      setFormData({ email: '', password: '', name: '', role: 'admin' });
      fetchAdmins();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (admin: Admin) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/admin/admins/${admin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !admin.isActive })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update admin');
      }

      fetchAdmins();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    if (!confirm(`Are you sure you want to delete ${admin.name}?`)) return;
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/admin/admins/${admin.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete admin');
      }

      fetchAdmins();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({ email: admin.email, password: '', name: admin.name, role: admin.role });
    setShowEditModal(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings & Admin Management</h1>
        {currentAdmin?.role === 'super_admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 font-medium"
          >
            + Add Admin
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Current User Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Account</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium text-gray-900">{currentAdmin?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-gray-900">{currentAdmin?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(currentAdmin?.role)}`}>
              {currentAdmin?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Admin List */}
      {currentAdmin?.role === 'super_admin' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Administrators</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{admin.name}</span>
                    {admin.id === currentAdmin?.id && (
                      <span className="ml-2 text-xs text-pink-600">(you)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(admin.role)}`}>
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    {admin.id !== currentAdmin?.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(admin)}
                          className={`text-sm font-medium ${admin.isActive ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'}`}
                        >
                          {admin.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* System Info */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">API Status</p>
            <p className="font-bold text-green-800">Online</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Network</p>
            <p className="font-bold text-blue-800">Stellar Testnet</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Token</p>
            <p className="font-bold text-purple-800">MAMA</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">API URL</p>
            <p className="font-bold text-gray-800 text-xs">api.mamatokens.com</p>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Admin</h2>
            <form onSubmit={handleAddAdmin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  >
                    <option value="viewer">Viewer (Read Only)</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && editingAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Admin</h2>
            <form onSubmit={handleUpdateAdmin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  >
                    <option value="viewer">Viewer (Read Only)</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingAdmin(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
