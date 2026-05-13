'use client';

import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useWalletBalance, useWalletTransactions } from '@/app/lib/hooks/useWallet';

export default function WalletPage() {
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: transactions, isLoading: txLoading } = useWalletTransactions();

  const mamaBalance = balance ? parseFloat(balance.mamaBalance || '0') : 0;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch { return 'Recently'; }
  };

  const formatFullDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  const getTxDescription = (type: string) => {
    switch (type) {
      case 'mint_milestone': return 'Quiz/Milestone Reward';
      case 'burn_redemption': return 'Token Redemption';
      default: return type.replace(/_/g, ' ');
    }
  };

  const isEarned = (type: string) => !type.includes('burn') && !type.includes('spend');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wallet</h1>

      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-lg">
        <div className="space-y-6">
          <div>
            <p className="text-blue-100 text-sm font-semibold">Available Balance</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-5xl font-bold">{balanceLoading ? '...' : mamaBalance}</p>
              <p className="text-2xl text-blue-100">MAMA</p>
            </div>
          </div>
          {balance?.hasWallet && (
            <div className="pt-4 border-t border-blue-400">
              <p className="text-blue-200 text-xs font-mono break-all">{balance.stellarAddress}</p>
            </div>
          )}
          {!balance?.hasWallet && !balanceLoading && (
            <div className="pt-4 border-t border-blue-400">
              <p className="text-blue-200 text-sm">No wallet created yet. Create one to start earning tokens.</p>
            </div>
          )}
        </div>
      </Card>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaction History</h2>

      {txLoading ? (
        <Card><p className="text-gray-600 text-center py-12">Loading transactions...</p></Card>
      ) : transactions && transactions.length > 0 ? (
        <div className="grid gap-3">
          {transactions.map((tx) => (
            <Card key={tx.id} hover>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`text-3xl ${isEarned(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                    {isEarned(tx.type) ? '📈' : '📉'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{getTxDescription(tx.type)}</p>
                    <p className="text-sm text-gray-500">{formatDate(tx.createdAt)}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatFullDate(tx.createdAt)}</p>
                    {tx.tx_hash && (
                      <p className="text-xs text-blue-500 mt-1 font-mono truncate max-w-xs">{tx.tx_hash}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg ${isEarned(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                    {isEarned(tx.type) ? '+' : ''}{tx.amount}
                  </div>
                  <span className={`text-xs font-semibold ${
                    tx.status === 'confirmed' || tx.status === 'completed' ? 'text-green-600' :
                    tx.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-gray-600 text-center py-12">No transactions yet. Complete quizzes and milestones to earn MAMA tokens!</p>
        </Card>
      )}
    </div>
  );
}
