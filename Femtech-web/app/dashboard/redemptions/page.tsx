'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useWalletBalance } from '@/app/lib/hooks/useWallet';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';
import { usePartners, usePartnerProducts, useRedeem, useVouchers } from '@/app/lib/hooks/useRedemptions';
import { Partner, PartnerProduct, Voucher } from '@/app/lib/types';

const partnerIcons: Record<string, string> = {
  mobile_money: '📱',
  healthcare: '🏥',
  retail: '🛒',
  transport: '🚗',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  used: 'bg-gray-100 text-gray-600',
  expired: 'bg-red-100 text-red-700',
  cancelled: 'bg-yellow-100 text-yellow-800',
};

export default function RedemptionsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { data: balance } = useWalletBalance();
  const { data: partners, isLoading: loadingPartners } = usePartners();
  const { data: vouchers } = useVouchers();
  const redeemMutation = useRedeem();

  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<PartnerProduct | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [successVoucher, setSuccessVoucher] = useState<Voucher | null>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'partners' | 'products' | 'confirm' | 'success'>('partners');

  const { data: products, isLoading: loadingProducts } = usePartnerProducts(selectedPartner?.id || null);

  const mamaBalance = balance ? parseFloat(balance.mamaBalance || '0') : 0;
  const recentVouchers = vouchers?.slice(0, 3) || [];

  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setSelectedProduct(null);
    setCustomAmount('');
    setError('');
    setStep('products');
  };

  const handleSelectProduct = (product: PartnerProduct) => {
    setSelectedProduct(product);
    setCustomAmount(String(product.tokenCost));
    setStep('confirm');
  };

  const handleRedeem = async () => {
    if (!selectedPartner) return;
    const amount = parseInt(customAmount);
    if (!amount || amount <= 0) {
      setError('Enter a valid token amount');
      return;
    }
    if (amount > mamaBalance) {
      setError('Insufficient MAMA balance');
      return;
    }
    setError('');
    try {
      const result = await redeemMutation.mutateAsync({
        partnerId: selectedPartner.id,
        productId: selectedProduct?.id,
        tokenAmount: amount,
      });
      setSuccessVoucher(result.voucher);
      setStep('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Redemption failed';
      setError(msg);
    }
  };

  const resetFlow = () => {
    setSelectedPartner(null);
    setSelectedProduct(null);
    setCustomAmount('');
    setError('');
    setSuccessVoucher(null);
    setStep('partners');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{t('redemptions.title')}</h1>
        <p className="text-gray-600 mt-2">{t('redemptions.subtitle')}</p>
      </div>

      <Card className={`mb-8 ${mamaBalance > 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className={`font-semibold ${mamaBalance > 0 ? 'text-green-900' : 'text-yellow-900'}`}>{t('redemptions.yourBalance')}</p>
            <p className={`text-sm mt-1 ${mamaBalance > 0 ? 'text-green-700' : 'text-yellow-700'}`}>
              {mamaBalance} MAMA {t('redemptions.tokensAvailable')}
            </p>
          </div>
          <p className="text-4xl font-bold text-green-600">{mamaBalance}</p>
        </div>
      </Card>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}

      {step === 'partners' && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose a Partner</h2>
          {loadingPartners ? (
            <p className="text-gray-500">Loading partners...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {partners?.map((partner) => (
                <div key={partner.id} onClick={() => handleSelectPartner(partner)} className="cursor-pointer">
                  <Card hover>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{partnerIcons[partner.type] || '🏪'}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{partner.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{partner.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {recentVouchers.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Your Recent Vouchers</h2>
                <button onClick={() => router.push('/dashboard/vouchers')} className="text-blue-600 hover:underline text-sm font-medium">
                  View All →
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {recentVouchers.map((v) => (
                  <div key={v.id} onClick={() => router.push(`/dashboard/vouchers/${v.id}`)} className="cursor-pointer">
                    <Card hover>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-gray-900">{v.partner.name}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[v.status]}`}>{v.status}</span>
                        </div>
                        <p className="text-sm text-gray-600">{v.product?.name || 'General Voucher'}</p>
                        <p className="text-lg font-bold text-green-600">{v.value.currency} {v.value.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 font-mono">{v.code}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {step === 'products' && selectedPartner && (
        <>
          <button onClick={() => setStep('partners')} className="text-blue-600 hover:underline mb-4 inline-block">← Back to Partners</button>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {partnerIcons[selectedPartner.type] || '🏪'} {selectedPartner.name}
          </h2>
          <p className="text-gray-500 mb-6 capitalize">{selectedPartner.type.replace('_', ' ')}</p>

          {loadingProducts ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products && products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => {
                const canAfford = mamaBalance >= product.tokenCost;
                return (
                  <div key={product.id} onClick={() => canAfford && handleSelectProduct(product)} className={canAfford ? 'cursor-pointer' : ''}>
                    <Card hover={canAfford} className={canAfford ? '' : 'opacity-50'}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900">{product.name}</h3>
                          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                            {product.tokenCost} MAMA
                          </span>
                        </div>
                        {product.description && <p className="text-sm text-gray-600">{product.description}</p>}
                        {product.category && <p className="text-xs text-gray-400">📁 {product.category}</p>}
                        {!canAfford && <p className="text-xs text-red-500 font-medium">Insufficient balance</p>}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <p className="text-gray-500 text-center">No products available for this partner.</p>
            </Card>
          )}
        </>
      )}

      {step === 'confirm' && selectedPartner && (
        <>
          <button onClick={() => setStep('products')} className="text-blue-600 hover:underline mb-4 inline-block">← Back to Products</button>
          <Card className="max-w-lg mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Confirm Redemption</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Partner</span>
                <span className="font-medium">{selectedPartner.name}</span>
              </div>
              {selectedProduct && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Product</span>
                  <span className="font-medium">{selectedProduct.name}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Tokens to Burn</span>
                <span className="font-bold text-lg text-blue-600">{customAmount} MAMA</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Voucher Value</span>
                <span className="font-bold text-lg text-green-600">ZAR {(parseFloat(customAmount) * 0.10).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Remaining Balance</span>
                <span className="font-medium">{(mamaBalance - parseFloat(customAmount || '0')).toFixed(0)} MAMA</span>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <Button variant="primary" className="w-full" isLoading={redeemMutation.isPending} onClick={handleRedeem}>
                {redeemMutation.isPending ? 'Processing...' : 'Confirm & Redeem'}
              </Button>
              <Button variant="secondary" className="w-full" onClick={resetFlow}>Cancel</Button>
            </div>
          </Card>
        </>
      )}

      {step === 'success' && successVoucher && (
        <Card className="max-w-lg mx-auto text-center">
          <div className="space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-green-700">Voucher Created!</h2>
            <p className="text-gray-600">Your voucher is ready to use.</p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <p className="text-sm text-gray-500">Voucher Code</p>
              <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">{successVoucher.code}</p>
              <p className="text-sm text-gray-500 mt-2">Value</p>
              <p className="text-3xl font-bold text-green-600">{successVoucher.value.currency} {successVoucher.value.amount.toFixed(2)}</p>
            </div>

            {successVoucher.qrCode && (
              <div className="flex justify-center">
                <img src={successVoucher.qrCode} alt="Voucher QR Code" className="w-48 h-48 rounded-lg border" />
              </div>
            )}

            <div className="space-y-3 pt-4">
              <Button variant="primary" className="w-full" onClick={() => router.push(`/dashboard/vouchers/${successVoucher.id}`)}>
                View Voucher Details
              </Button>
              <Button variant="secondary" className="w-full" onClick={resetFlow}>
                Redeem More Tokens
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
