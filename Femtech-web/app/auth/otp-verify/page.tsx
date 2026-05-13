'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/common/Button';
import { useVerifyOtp, useRequestOtp } from '@/app/lib/hooks/useAuth';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';
import apiClient from '@/app/lib/api/client';

export default function OtpVerifyPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [walletStatus, setWalletStatus] = useState('');
  const setAuthUser = useAuthStore((state) => state.setUser);
  const setAuthToken = useAuthStore((state) => state.setToken);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useRequestOtp();

  useEffect(() => {
    const pendingPhone = sessionStorage.getItem('pendingPhone');
    if (!pendingPhone) {
      router.push('/auth/login');
    } else {
      setPhone(pendingPhone);
    }
  }, [router]);

  const ensureWallet = async () => {
    try {
      // Check if user already has a wallet
      const balanceRes = await apiClient.get('/wallet/balance');
      if (balanceRes.data.hasWallet) {
        return; // Wallet exists
      }
    } catch {
      // No wallet or error checking
    }

    try {
      setWalletStatus(t('wallet.autoCreating'));
      await apiClient.post('/wallet/create');
      setWalletStatus(t('wallet.walletCreated'));
    } catch (err) {
      console.error('Auto wallet creation failed:', err);
      // Non-blocking — user can still proceed
      setWalletStatus('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length < 4) {
      setError(t('auth.invalidOtp'));
      return;
    }

    try {
      const response = await verifyOtpMutation.mutateAsync({ phone, otp });

      const userData = response.user;

      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      setAuthToken(response.token);
      setAuthUser(userData);

      sessionStorage.removeItem('pendingPhone');

      // Auto-create wallet if user doesn't have one
      await ensureWallet();

      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message || t('auth.invalidOtp'));
      console.error(err);
    }
  };

  const handleResend = async () => {
    const country = sessionStorage.getItem('pendingCountry') || 'ZA';
    try {
      await resendOtpMutation.mutateAsync({ phone, country });
      setError('OTP resent successfully!');
    } catch {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600">
          {t('auth.enterOtp')} <strong>{phone}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('auth.verifyOtp')}
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className="w-full px-4 py-2 text-3xl text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono tracking-widest"
          />
        </div>

        {error && (
          <div className={`p-3 rounded-lg text-sm ${error.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        )}

        {walletStatus && (
          <div className="p-3 rounded-lg text-sm bg-blue-50 text-blue-700">
            {walletStatus}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={verifyOtpMutation.isPending}
          className="w-full"
        >
          {t('auth.verifyOtp')}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {t('auth.resendCode')}{' '}
          <button
            onClick={handleResend}
            disabled={resendOtpMutation.isPending}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            {t('auth.resend')}
          </button>
        </p>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-700 space-y-1">
        <p><strong>{t('auth.testMode')}:</strong></p>
        <p>Phone: {phone}</p>
        <p>OTP: <strong>123456</strong></p>
      </div>
    </div>
  );
}
