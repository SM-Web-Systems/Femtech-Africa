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

  // Redirect if already logged in
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

      await login(phone.trim(), country);
      setStep('otp'); // Move to OTP step on success
    } catch {
      // Error is already set in AuthContext, but we surface it locally too
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
      router.push('/profile'); // Redirect on success
    } catch {
      setLocalError('Invalid OTP. Please try again.');
    }
  };

  const displayError = localError || error;

  return (
    <main className="login-root">
      <div className="login-card">

        {/* Brand */}
        <div className="login-brand">
          <span className="login-brand-icon">♀</span>
          <h1 className="login-title">Femtech</h1>
        </div>

        <p className="login-subtitle">
          {step === 'phone'
            ? 'Enter your phone number to receive a one-time code.'
            : `We sent a code to ${phone}. Enter it below.`}
        </p>

        {/* Error */}
        {displayError && (
          <div className="login-error" role="alert">
            {displayError}
          </div>
        )}

        {/* ── Step 1: Phone ── */}
        {step === 'phone' && (
          <div className="login-form">
            <div className="input-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="ZA">🇿🇦 South Africa (+27)</option>
                <option value="NG">🇳🇬 Nigeria (+234)</option>
                <option value="KE">🇰🇪 Kenya (+254)</option>
                <option value="GH">🇬🇭 Ghana (+233)</option>
                <option value="GB">🇬🇧 United Kingdom (+44)</option>
                <option value="US">🇺🇸 United States (+1)</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g. 0821234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePhoneSubmit()}
                autoFocus
              />
            </div>

            <button
              className="login-btn"
              onClick={handlePhoneSubmit}
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" /> : 'Send Code'}
            </button>
          </div>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 'otp' && (
          <div className="login-form">
            <div className="input-group">
              <label htmlFor="otp">One-Time Code</label>
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
              />
            </div>

            <button
              className="login-btn"
              onClick={handleOtpSubmit}
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" /> : 'Verify & Sign In'}
            </button>

            <button
              className="login-back"
              onClick={() => { setStep('phone'); setOtp(''); clearError(); setLocalError(null); }}
            >
              ← Use a different number
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@400;500&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fdf6f0;
          font-family: 'DM Sans', sans-serif;
          padding: 1rem;
        }

        .login-card {
          background: #fff;
          border: 1px solid #f0e8e0;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 8px 40px rgba(180, 120, 80, 0.08);
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .login-brand-icon {
          font-size: 1.8rem;
          color: #c47c5a;
          line-height: 1;
        }

        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: #2d1a0e;
          margin: 0;
          font-weight: 700;
        }

        .login-subtitle {
          color: #8a6a55;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0 0 1.5rem;
        }

        .login-error {
          background: #fff1ee;
          border: 1px solid #f5c6b8;
          color: #b0391a;
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .input-group label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #5c3d2a;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .input-group input,
        .input-group select {
          border: 1.5px solid #e8d8cc;
          border-radius: 10px;
          padding: 0.7rem 0.9rem;
          font-size: 1rem;
          font-family: 'DM Sans', sans-serif;
          color: #2d1a0e;
          background: #fdf9f7;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .input-group input:focus,
        .input-group select:focus {
          border-color: #c47c5a;
          background: #fff;
        }

        .login-btn {
          margin-top: 0.25rem;
          background: #c47c5a;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.85rem;
          font-size: 1rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
        }

        .login-btn:hover:not(:disabled) {
          background: #a8613f;
        }

        .login-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-back {
          background: none;
          border: none;
          color: #8a6a55;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          padding: 0;
          text-align: center;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .login-back:hover {
          color: #c47c5a;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
