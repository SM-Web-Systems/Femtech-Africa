'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { useGetProfile, useUpdateProfile } from '@/app/lib/hooks/useProfile';
import { useWalletBalance } from '@/app/lib/hooks/useWallet';
import { useLanguage, languages as langList } from '@/app/lib/i18n/LanguageContext';

export default function ProfilePage() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useGetProfile();
  const { data: balance } = useWalletBalance();
  const updateProfileMutation = useUpdateProfile();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile && profile.exists) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setEmail(profile.email || '');
      setDateOfBirth(profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '');
    }
  }, [profile]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/');
  };

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        firstName,
        lastName,
        email: email || undefined,
        dateOfBirth: dateOfBirth || undefined
      });
      setEditing(false);
      setMessage(t('common.success'));
      refetchProfile();
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage(t('common.error'));
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const showForm = editing || !profile?.exists;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message === t('common.error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      {!profile?.exists && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-800 font-medium">{t('profile.completeProfile')}</p>
        </div>
      )}

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {profile?.exists ? (profile.firstName ? `${profile.firstName} ${profile.lastName || ''}` : t('profile.editProfile')) : t('profile.editProfile')}
          </h2>
          {profile?.exists && !editing && (
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
              {t('profile.editBtn')}
            </Button>
          )}
        </div>

        {showForm ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.firstName')}</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.lastName')}</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.dateOfBirth')}</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={updateProfileMutation.isPending}
              >
                {t('profile.saveProfile')}
              </Button>
              {editing && (
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  {t('profile.cancelBtn')}
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </Card>

      {/* Account Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.account')}</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('profile.phone')}</span>
            <span className="font-medium">{user?.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('profile.email')}</span>
            <span className="font-medium">{profile?.email || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('profile.country')}</span>
            <span className="font-medium">{user?.country ? t(`countries.${user.country}`) : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('profile.memberSince')}</span>
            <span className="font-medium">
              {(profile?.memberSince || user?.createdAt)
                ? new Date(profile?.memberSince || user?.createdAt).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('wallet.address')}</span>
            <span className="font-medium text-xs break-all max-w-[200px]">
              {balance?.stellarAddress || user?.walletAddress || t('wallet.noWallet')}
            </span>
          </div>
        </div>
      </Card>

      {/* Language Selection */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.language')}</h2>
        <p className="text-sm text-gray-600 mb-3">{t('profile.selectLanguage')}</p>
        <div className="grid grid-cols-2 gap-3">
          {langList.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                language === lang.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <div className="font-medium">{lang.native}</div>
                <div className="text-xs text-gray-500">{lang.name}</div>
              </div>
              {language === lang.code && <span className="ml-auto text-blue-600 font-bold">✓</span>}
            </button>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.preferences')}</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('profile.notifications')}</span>
            <span className="text-sm text-green-600 font-medium">Enabled</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('profile.theme')}</span>
            <span className="text-sm text-gray-600 font-medium">{t('profile.lightMode')}</span>
          </div>
        </div>
      </Card>

      {/* Support */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.support')}</h2>
        <div className="space-y-2">
          <Button variant="secondary" size="sm" className="w-full">
            {t('profile.faq')}
          </Button>
          <Button variant="secondary" size="sm" className="w-full">
            {t('profile.contactUs')}
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200">
        <h2 className="text-lg font-semibold text-red-700 mb-4">{t('profile.dangerZone')}</h2>
        <p className="text-sm text-gray-600 mb-4">{t('auth.logoutConfirm')}</p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
            {t('profile.deleteAccount')}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            {t('auth.logout')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
