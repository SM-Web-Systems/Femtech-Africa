'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

type Step = 'phone' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const { login, verifyOtp, isAuthenticated, isLoading, error, clearError } = useAuth();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('ZA');
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [formattedPhone, setFormattedPhone] = useState('');

  const formatPhone = (phone: string, country: string): string => {
    const countryCodes: Record<string, string> = {
      ZA: '+27', NG: '+234', KE: '+254',
      GH: '+233', GB: '+44', US: '+1'
    };
    const digits = phone.replace(/^\+/, '').replace(/^0/, '');
    return `${countryCodes[country]}${digits}`;
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handlePhoneSubmit = async () => {
    setLocalError(null);
    clearError();

    if (!phone.trim()) {
      setLocalError('Please enter your phone number.');
      return;
    }

    try {
      const formatted = formatPhone(phone.trim(), country);
      setFormattedPhone(formatted);
      await login(formatted, country);
      setStep('otp');
    } catch {
      setLocalError('Failed to send OTP. Please check your number and try again.');
    }
  };

  const handleOtpSubmit = async () => {
    setLocalError(null);
    clearError();

    if (!otp.trim() || otp.length < 4) {
      setLocalError('Please enter the full OTP code.');
      return;
    }

    try {
      await verifyOtp(formattedPhone, otp.trim());
      router.push('/profile');
    } catch {
      setLocalError('Invalid OTP. Please try again.');
    }
  };

  const displayError = localError || error;

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 w-full max-w-md">

        {/* Brand */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-blue-600">Femtech</h1>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          {step === 'phone'
            ? 'Enter your phone number to receive a one-time code.'
            : `We sent a code to ${phone}. Enter it below.`}
        </p>

        {/* Error */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5" role="alert">
            {displayError}
          </div>
        )}

        {/* ── Step 1: Phone ── */}
        {step === 'phone' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="country" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition w-full"
              >
                <option value="ZA">🇿🇦 South Africa (+27)</option>
                <option value="NG">🇳🇬 Nigeria (+234)</option>
                <option value="KE">🇰🇪 Kenya (+254)</option>
                <option value="GH">🇬🇭 Ghana (+233)</option>
                <option value="GB">🇬🇧 United Kingdom (+44)</option>
                <option value="US">🇺🇸 United States (+1)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g. 0821234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePhoneSubmit()}
                autoFocus
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition w-full"
              />
            </div>

            <button
              onClick={handlePhoneSubmit}
              disabled={isLoading}
              className="mt-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 transition flex items-center justify-center"
            >
              {isLoading
                ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : 'Send Code'
              }
            </button>
          </div>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 'otp' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="otp" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                One-Time Code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleOtpSubmit()}
                autoFocus
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition w-full tracking-widest text-center text-lg"
              />
            </div>

            <button
              onClick={handleOtpSubmit}
              disabled={isLoading}
              className="mt-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 transition flex items-center justify-center"
            >
              {isLoading
                ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : 'Verify & Sign In'
              }
            </button>

            <button
              onClick={() => { setStep('phone'); setOtp(''); clearError(); setLocalError(null); }}
              className="text-gray-400 hover:text-blue-600 text-sm underline underline-offset-2 transition text-center"
            >
              ← Use a different number
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
