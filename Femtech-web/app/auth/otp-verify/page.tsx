'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/common/Button';
import { useVerifyOtp } from '@/app/lib/hooks/useAuth';
import { useAuthStore } from '@/app/lib/store/auth.store';

export default function OtpVerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const setAuthUser = useAuthStore((state) => state.setUser);
  const setAuthToken = useAuthStore((state) => state.setToken);
  
  const verifyOtpMutation = useVerifyOtp();

  useEffect(() => {
    const pendingPhone = sessionStorage.getItem('pendingPhone');
    if (!pendingPhone) {
      router.push('/auth/login');
    } else {
      setPhone(pendingPhone);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    try {
      const response = await verifyOtpMutation.mutateAsync({ phone, otp });
      
      const userData = response.users;
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      setAuthToken(response.token);
      setAuthUser(userData);
      
      sessionStorage.removeItem('pendingPhone');
      
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Invalid OTP. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600">
          We sent an OTP to <strong>{phone}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter OTP
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
          <div className={`p-3 rounded-lg text-sm ${error.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={verifyOtpMutation.isPending}
          className="w-full"
        >
          Verify OTP
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the OTP?{' '}
          <button className="text-blue-600 hover:text-blue-700 font-semibold">
            Resend
          </button>
        </p>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-700 space-y-1">
        <p>💡 <strong>Test Mode:</strong></p>
        <p>Phone: {phone}</p>
        <p>OTP: <strong>123456</strong></p>
      </div>
    </div>
  );
}
