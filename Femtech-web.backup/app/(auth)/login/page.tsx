// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

const countries = ['Kenya', 'Uganda', 'Ethiopia', 'Nigeria', 'Ghana'];

export default function LoginPage() {
  const router = useRouter();
  const { requestOtp } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Simulate OTP request - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem('pending_phone', phone);
      localStorage.setItem('pending_country', country);
      router.push('/otp-verify');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Femtech Africa
          </h1>
          <p className="text-gray-600">
            Maternal Health Intelligence Platform
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
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254700000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !phone}
            isLoading={isLoading}
            className="w-full"
          >
            Get OTP
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          We'll send you a code to verify your phone number
        </p>
      </Card>
    </div>
  );
}
