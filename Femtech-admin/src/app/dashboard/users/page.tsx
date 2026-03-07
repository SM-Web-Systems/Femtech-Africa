"use client";

import { useState } from "react";

const mockUsers = [
  { id: "1", phone: "+27612345678", country: "ZA", status: "active", balance: 120, milestones: 5, createdAt: "2026-03-01" },
  { id: "2", phone: "+27698765432", country: "ZA", status: "active", balance: 85, milestones: 3, createdAt: "2026-03-02" },
  { id: "3", phone: "+254712345678", country: "KE", status: "active", balance: 200, milestones: 8, createdAt: "2026-03-03" },
  { id: "4", phone: "+27623456789", country: "ZA", status: "inactive", balance: 0, milestones: 0, createdAt: "2026-03-04" },
  { id: "5", phone: "+234812345678", country: "NG", status: "active", balance: 50, milestones: 2, createdAt: "2026-03-05" },
  { id: "6", phone: "+27634567890", country: "ZA", status: "active", balance: 175, milestones: 6, createdAt: "2026-03-05" },
  { id: "7", phone: "+233201234567", country: "GH", status: "suspended", balance: 30, milestones: 1, createdAt: "2026-03-06" },
  { id: "8", phone: "+27645678901", country: "ZA", status: "active", balance: 95, milestones: 4, createdAt: "2026-03-07" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.phone.includes(search);
    const matchesFilter = filter === "all" || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      suspended: "bg-red-100 text-red-700",
    };
    return styles[status] || styles.inactive;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500">Manage all registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Phone</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Country</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Balance</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Milestones</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{user.country}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-pink-600">{user.balance} MAMA</td>
                  <td className="px-6 py-4 text-gray-600">{user.milestones}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t">
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {mockUsers.length} users</p>
        </div>
      </div>
    </div>
  );
}
