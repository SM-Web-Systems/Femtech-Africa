'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';
import { useVoucherDetail } from '@/app/lib/hooks/useRedemptions';

const statusConfig: Record<string, { color: string; label: string; bg: string }> = {
  active: { color: 'text-green-700', label: 'Active', bg: 'bg-green-100' },
  used: { color: 'text-gray-600', label: 'Used', bg: 'bg-gray-100' },
  expired: { color: 'text-red-700', label: 'Expired', bg: 'bg-red-100' },
  cancelled: { color: 'text-yellow-700', label: 'Cancelled', bg: 'bg-yellow-100' },
};

export default function VoucherDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { data: voucher, isLoading } = useVoucherDetail(id as string);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          <p className="text-gray-500 mt-4">Loading voucher...</p>
        </div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Voucher not found.</p>
        <button onClick={() => router.push('/dashboard/vouchers')} className="text-blue-600 hover:underline mt-4">
          ← Back to Vouchers
        </button>
      </div>
    );
  }

  const status = statusConfig[voucher.status] || statusConfig.active;
  const isExpired = voucher.status === 'expired';
  const isActive = voucher.status === 'active';
  const daysLeft = isActive ? Math.max(0, Math.ceil((new Date(voucher.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button onClick={() => router.push('/dashboard/vouchers')} className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Vouchers
      </button>

      {/* Main voucher card */}
      <Card className="overflow-hidden">
        {/* Header with status */}
        <div className={`${isActive ? 'bg-green-50' : isExpired ? 'bg-red-50' : 'bg-gray-50'} -mx-6 -mt-6 px-6 py-4 mb-6 flex justify-between items-center`}>
          <div>
            <p className="font-bold text-lg text-gray-900">{voucher.partner.name}</p>
            <p className="text-sm text-gray-500">{voucher.product?.name || 'General Voucher'}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Value */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">Voucher Value</p>
          <p className="text-5xl font-bold text-green-600">{voucher.value.currency} {voucher.value.amount.toFixed(2)}</p>
          <p className="text-sm text-gray-400 mt-2">{voucher.tokensBurned} MAMA tokens burned</p>
        </div>

        {/* QR Code */}
        {voucher.qrCode && (
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-xl border-2 border-dashed border-gray-200">
              <img src={voucher.qrCode} alt="Voucher QR Code" className="w-56 h-56" />
            </div>
          </div>
        )}

        {/* Voucher Code */}
        <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Voucher Code</p>
          <p className="text-2xl font-mono font-bold text-gray-900 tracking-widest">{voucher.code}</p>
        </div>

        {/* Barcode */}
        {voucher.barcode && (
          <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Barcode</p>
            <p className="text-lg font-mono text-gray-700 tracking-widest">{voucher.barcode}</p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Created</span>
            <span className="font-medium">{new Date(voucher.createdAt).toLocaleDateString()} {new Date(voucher.createdAt).toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Expires</span>
            <span className={`font-medium ${isActive ? (daysLeft <= 7 ? 'text-red-600' : 'text-gray-900') : 'text-gray-400'}`}>
              {new Date(voucher.expiresAt).toLocaleDateString()}
              {isActive && ` (${daysLeft} days left)`}
            </span>
          </div>
          {voucher.usedAt && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Used At</span>
              <span className="font-medium">{new Date(voucher.usedAt).toLocaleDateString()}</span>
            </div>
          )}
          {voucher.txHash && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Transaction</span>
              <span className="font-mono text-xs text-blue-600 truncate ml-4">{voucher.txHash}</span>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 space-y-3">
        <Button variant="primary" className="w-full" onClick={() => router.push('/dashboard/redemptions')}>
          Redeem More Tokens
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => router.push('/dashboard/vouchers')}>
          All My Vouchers
        </Button>
      </div>
    </div>
  );
}
