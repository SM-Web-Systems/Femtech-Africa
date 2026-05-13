'use client';

import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { useGetProfile } from '@/app/lib/hooks/useProfile';
import { useWalletBalance } from '@/app/lib/hooks/useWallet';
import { useMyQuizAttempts } from '@/app/lib/hooks/useQuizzes';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: profileData, isLoading } = useGetProfile(true);
  const { data: balance } = useWalletBalance();
  const { data: attempts } = useMyQuizAttempts();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/');
  };

  const displayName = profileData?.firstName
    ? `${profileData.firstName} ${profileData.lastName || ''}`.trim()
    : user?.phone || 'User';

  const passedQuizzes = attempts?.filter(a => a.passed).length || 0;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl">👤</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-gray-600 mt-1">{user?.phone || 'N/A'}</p>
            <p className="text-sm text-blue-600 font-semibold mt-2">{passedQuizzes} quizzes passed</p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Phone Number</p>
              <p className="text-gray-900 font-semibold mt-1">{user?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Country</p>
              <p className="text-gray-900 font-semibold mt-1">{user?.country || 'N/A'}</p>
            </div>
            {profileData?.firstName && (
              <div>
                <p className="text-sm text-gray-500 font-semibold">Name</p>
                <p className="text-gray-900 font-semibold mt-1">{profileData.firstName} {profileData.lastName}</p>
              </div>
            )}
            {user?.createdAt && (
              <div>
                <p className="text-sm text-gray-500 font-semibold">Account Created</p>
                <p className="text-gray-900 font-semibold mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Wallet</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Status</p>
              <p className="text-gray-900 font-semibold mt-1">{balance?.hasWallet ? 'Active' : 'Not created'}</p>
            </div>
            {balance?.stellarAddress && (
              <div>
                <p className="text-sm text-gray-500 font-semibold">Stellar Address</p>
                <p className="text-gray-900 font-mono text-xs mt-1 break-all">{balance.stellarAddress}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 font-semibold">MAMA Balance</p>
              <p className="text-gray-900 font-semibold mt-1">{balance ? parseFloat(balance.mamaBalance || '0') : 0} MAMA</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-red-200 bg-red-50">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-red-900">Account</h3>
          <Button variant="danger" onClick={handleLogout} className="w-full">
            🚪 Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
