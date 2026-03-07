"use client";

import { useState } from "react";

const mockRedemptions = [
  { id: "r1", user: "+27612345678", partner: "MTN", product: "R10 Airtime", tokens: 50, voucherCode: "VOUCHER-ABC123", status: "completed", createdAt: "2026-03-07 14:30" },
  { id: "r2", user: "+27698765432", partner: "Vodacom", product: "R25 Airtime", tokens: 100, voucherCode: "VOUCHER-DEF456", status: "completed", createdAt: "2026-03-07 13:15" },
  { id: "r3", user: "+254712345678", partner: "Shoprite", product: "R50 Voucher", tokens: 200, voucherCode: "VOUCHER-GHI789", status: "pending", createdAt: "2026-03-07 12:00" },
  { id: "r4", user: "+27623456789", partner: "Clicks", product: "R20 Voucher", tokens: 80, voucherCode: "VOUCHER-JKL012", status: "completed", createdAt: "2026-03-06 16:45" },
  { id: "r5", user: "+234812345678", partner: "MTN", product: "R50 Airtime", tokens: 200, voucherCode: "", status: "failed", createdAt: "2026-03-06 15:30" },
];

export default function RedemptionsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRedemptions = mockRedemptions.filter(r => {
    return statusFilter === "all" || r.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
    };
    return styles[status] || styles.pending;
  };

  const totalTokens = mockRedemptions.filter(r => r.status === "completed").reduce((sum, r) => sum + r.tokens, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Redemptions</h1>
          <p className="text-gray-500">Track all token redemptions and vouchers</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Redemptions</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{mockRedemptions.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Tokens Redeemed</p>
          <p className="text-2xl font-bold text-pink-600 mt-1">{totalTokens} MAMA</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{mockRedemptions.filter(r => r.status === "pending").length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Partner</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tokens</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Voucher</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRedemptions.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">{r.user}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{r.partner}</td>
                  <td className="px-6 py-4 text-gray-600">{r.product}</td>
                  <td className="px-6 py-4 font-semibold text-pink-600">{r.tokens} MAMA</td>
                  <td className="px-6 py-4">
                    {r.voucherCode ? (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{r.voucherCode}</code>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
