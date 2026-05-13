'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/common/Button';
import { useRequestOtp } from '@/app/lib/hooks/useAuth';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';

const COUNTRY_CODES: Record<string, string> = {
  'ZA': '+27',
  'NG': '+234',
  'KE': '+254',
  'UG': '+256',
  'TZ': '+255',
  'GH': '+233',
};

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('ZA');
  const [error, setError] = useState('');

  const requestOtpMutation = useRequestOtp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length < 9) {
      setError(t('auth.invalidPhone'));
      return;
    }

    const prefix = COUNTRY_CODES[country] || '+27';
    const fullPhone = `${prefix}${phone.replace(/\D/g, '')}`;

    try {
      await requestOtpMutation.mutateAsync({ phone: fullPhone, country });
      sessionStorage.setItem('pendingPhone', fullPhone);
      sessionStorage.setItem('pendingCountry', country);
      router.push('/auth/otp-verify');
    } catch (err) {
      setError((err as Error).message || t('auth.invalidPhone'));
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('auth.country')}
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ZA">🇿🇦 {t('countries.ZA')} (+27)</option>
            <option value="NG">🇳🇬 {t('countries.NG')} (+234)</option>
            <option value="KE">🇰🇪 {t('countries.KE')} (+254)</option>
            <option value="UG">🇺🇬 {t('countries.UG')} (+256)</option>
            <option value="TZ">🇹🇿 {t('countries.TZ')} (+255)</option>
            <option value="GH">🇬🇭 {t('countries.GH')} (+233)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('auth.phoneNumber')}
          </label>
          <div className="flex gap-2">
            <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 flex items-center font-semibold text-gray-700 whitespace-nowrap">
              {COUNTRY_CODES[country] || '+27'}
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="81 234 5678"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={requestOtpMutation.isPending}
          className="w-full"
        >
          {t('auth.sendOtp')}
        </Button>
      </form>

      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 space-y-2">
        <p>{t('auth.otpInfo')}</p>
        <p className="font-semibold">Test: ZA, 812345678, OTP 123456</p>
      </div>
    </div>
  );
}
