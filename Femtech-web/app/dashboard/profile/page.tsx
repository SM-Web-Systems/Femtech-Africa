'use client';

import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { useGetProfile } from '@/app/lib/hooks/useProfile';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: profileData, isLoading } = useGetProfile(true);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/');
  };

  const displayUser = profileData || user;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
          </div>
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
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl">
            👤
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{displayUser?.name || 'User'}</h2>
            <p className="text-gray-600 mt-1">{displayUser?.phone || 'N/A'}</p>
            {displayUser?.pregnancyWeek && (
              <p className="text-sm text-blue-600 font-semibold mt-2">Week {displayUser.pregnancyWeek} of pregnancy</p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Phone Number</p>
              <p className="text-gray-900 font-semibold mt-1">{displayUser?.phone || 'N/A'}</p>
            </div>

            {displayUser?.email && (
              <div>
                <p className="text-sm text-gray-500 font-semibold">Email Address</p>
                <p className="text-gray-900 font-semibold mt-1">{displayUser.email}</p>
              </div>
            )}

            {displayUser?.country && (
              <div>
                <p className="text-sm text-gray-500 font-semibold">Country</p>
                <p className="text-gray-900 font-semibold mt-1">{displayUser.country}</p>
              </div>
            )}

            {displayUser?.createdAt && (
              <div>
                <p className="text-sm text-gray-500 font-semibold">Account Created</p>
                <p className="text-gray-900 font-semibold mt-1">
                  {new Date(displayUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <Button variant="secondary" className="w-full">
              ✏️ Edit Profile
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Language</p>
              <p className="text-gray-900 font-semibold mt-1">English</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">Notifications</p>
              <p className="text-gray-900 font-semibold mt-1">Enabled</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">Theme</p>
              <p className="text-gray-900 font-semibold mt-1">Light Mode</p>
            </div>

            <Button variant="outline" className="w-full">
              ⚙️ Settings
            </Button>
          </div>
        </Card>
      </div>

      {/* Support & Danger Zone */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Support & Resources</h3>
            <Button variant="outline" className="w-full justify-start">
              ❓ Help & FAQ
            </Button>
            <Button variant="outline" className="w-full justify-start">
              📧 Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              📋 Terms of Service
            </Button>
            <Button variant="outline" className="w-full justify-start">
              🔒 Privacy Policy
            </Button>
          </div>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-red-900">Danger Zone</h3>
            <p className="text-sm text-red-700">
              Once you log out, you'll need to sign in again with your phone number.
            </p>
            <Button 
              variant="danger" 
              onClick={handleLogout}
              className="w-full"
            >
              🚪 Logout
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              🗑️ Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
