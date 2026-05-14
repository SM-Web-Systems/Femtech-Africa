'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/app/components/common/Card';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';
import { useVouchers } from '@/app/lib/hooks/useRedemptions';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  used: 'bg-gray-100 text-gray-600',
  expired: 'bg-red-100 text-red-700',
  cancelled: 'bg-yellow-100 text-yellow-800',
};

const partnerIcons: Record<string, string> = {
  healthcare: '🏥',
  transport: '🚗',
  mobile_money: '📱',
  retail: '🛒',
};

const tabs = ['all', 'active', 'used', 'expired'] as const;

export default function VouchersPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('all');
  const { data: vouchers, isLoading } = useVouchers(activeTab === 'all' ? undefined : activeTab);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Vouchers</h1>
          <p className="text-gray-600 mt-2">View and manage your redeemed vouchers</p>
        </div>
        <button onClick={() => router.push('/dashboard/redemptions')} className="text-blue-600 hover:underline font-medium">
          + Redeem More
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition ${
              activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          <p className="text-gray-500 mt-4">Loading vouchers...</p>
        </div>
      ) : vouchers && vouchers.length > 0 ? (
        <div className="space-y-4">
          {vouchers.map((v) => (
            <div key={v.id} onClick={() => router.push(`/dashboard/vouchers/${v.id}`)} className="cursor-pointer">
              <Card hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                      {partnerIcons[v.partner.type || ''] || '🛒'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{v.partner.name}</p>
                      <p className="text-sm text-gray-500">{v.product?.name || 'General Voucher'}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">{v.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">{v.value.currency} {v.value.amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[v.status]}`}>{v.status}</span>
                    <p className="text-xs text-gray-400 mt-1">
                      {v.status === 'active' ? `Expires ${new Date(v.expiresAt).toLocaleDateString()}` : new Date(v.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 bg-gray-50">
          <div className="text-5xl mb-4">🎟️</div>
          <h3 className="text-lg font-semibold text-gray-700">No vouchers yet</h3>
          <p className="text-gray-500 mt-2">Redeem your MAMA tokens to get vouchers for healthcare, groceries, transport, and more.</p>
          <button onClick={() => router.push('/dashboard/redemptions')} className="mt-4 text-blue-600 hover:underline font-medium">
            Redeem Tokens →
          </button>
        </Card>
      )}
    </div>
  );
}
