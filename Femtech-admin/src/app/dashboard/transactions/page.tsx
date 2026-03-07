"use client";

import { useState } from "react";

const mockTransactions = [
  { id: "tx1", type: "mint_milestone", user: "+27612345678", amount: 100, status: "confirmed", txHash: "abc123...def", createdAt: "2026-03-07 14:30" },
  { id: "tx2", type: "burn_redemption", user: "+27698765432", amount: -50, status: "confirmed", txHash: "ghi456...jkl", createdAt: "2026-03-07 14:15" },
  { id: "tx3", type: "mint_milestone", user: "+254712345678", amount: 10, status: "confirmed", txHash: "mno789...pqr", createdAt: "2026-03-07 13:45" },
  { id: "tx4", type: "mint_referral", user: "+27623456789", amount: 25, status: "confirmed", txHash: "stu012...vwx", createdAt: "2026-03-07 12:30" },
  { id: "tx5", type: "burn_redemption", user: "+234812345678", amount: -100, status: "pending", txHash: "yza345...bcd", createdAt: "2026-03-07 11:00" },
  { id: "tx6", type: "mint_milestone", user: "+27634567890", amount: 50, status: "confirmed", txHash: "efg678...hij", createdAt: "2026-03-07 10:30" },
];

export default function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTx = mockTransactions.filter(tx => {
    return typeFilter === "all" || tx.type.includes(typeFilter);
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-gray-500">View all token transactions on Stellar</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Types</option>
            <option value="mint">Mints</option>
            <option value="burn">Burns</option>
          </select>
          <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">TX Hash</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{tx.amount > 0 ? "⬇️" : "⬆️"}</span>
                      <span className="text-gray-800">{tx.type.replace(/_/g, " ")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{tx.user}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${tx.amount > 0 ? "text-pink-600" : "text-green-600"}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount} MAMA
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a href={`https://stellar.expert/explorer/testnet/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {tx.txHash} ↗
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{tx.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
