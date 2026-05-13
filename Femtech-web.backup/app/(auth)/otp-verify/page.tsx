// app/(auth)/otp-verify/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function OTPVerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const phone = localStorage.getItem('pending_phone');
    const country = localStorage.getItem('pending_country');
    
    if (!phone || !country) {
      router.push('/login');
      return;
    }
    
    setPhone(phone);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.removeItem('pending_phone');
      localStorage.removeItem('pending_country');
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Code
          </h2>
          <p className="text-gray-600">
            We sent a code to {phone}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
              required
              maxLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || otp.length !== 6 || timeLeft === 0}
            isLoading={isLoading}
            className="w-full"
          >
            Verify Code
          </Button>
        </form>

        <div className="mt-6 text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-600">
              Code expires in {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          ) : (
            <p className="text-sm text-red-600">Code has expired</p>
          )}
        </div>

        <button
          onClick={() => router.push('/login')}
          className="w-full mt-4 text-sm text-pink-600 hover:text-pink-700 font-medium"
        >
          Use a different phone number
        </button>
      </Card>
    </div>
  );
}
