'use client';

import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useWalletBalance } from '@/app/lib/hooks/useWallet';
import { useState } from 'react';

const redemptionItems = [
  { id: '1', name: 'Prenatal Checkup', description: 'Professional prenatal check with certified midwife or doctor', cost: 200, provider: 'HealthCare Plus', category: 'Medical', icon: '🏥' },
  { id: '2', name: 'Nutritional Consultation', description: 'One-on-one session with a certified nutrition specialist', cost: 150, provider: 'Wellness Center', category: 'Wellness', icon: '🥗' },
  { id: '3', name: 'Prenatal Yoga Class', description: '5 sessions of guided prenatal yoga for flexibility and relaxation', cost: 100, provider: 'Yoga Studio', category: 'Wellness', icon: '🧘‍♀️' },
  { id: '4', name: 'Mental Health Counseling', description: '3 sessions with a certified perinatal psychologist', cost: 250, provider: 'Mental Health Clinic', category: 'Mental Health', icon: '🧠' },
  { id: '5', name: 'Vitamin & Mineral Pack', description: 'Prenatal vitamins and minerals for healthy pregnancy', cost: 75, provider: 'Pharmacy Partner', category: 'Supplements', icon: '💊' },
  { id: '6', name: 'Ultrasound Scan', description: 'Detailed ultrasound scan with certified technician', cost: 300, provider: 'Diagnostic Center', category: 'Medical', icon: '📡' },
];

export default function RedemptionsPage() {
  const { data: balance } = useWalletBalance();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mamaBalance = balance ? parseFloat(balance.mamaBalance || '0') : 0;

  const handleRedeem = (id: string) => {
    setSelectedId(id);
    setTimeout(() => setSelectedId(null), 2000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Redeem Your Tokens</h1>
        <p className="text-gray-600 mt-2">Use your MAMA tokens for quality maternal health services</p>
      </div>

      <Card className={`mb-8 ${mamaBalance > 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className={`font-semibold ${mamaBalance > 0 ? 'text-green-900' : 'text-yellow-900'}`}>
              Your Current Balance
            </p>
            <p className={`text-sm mt-1 ${mamaBalance > 0 ? 'text-green-700' : 'text-yellow-700'}`}>
              You have {mamaBalance} MAMA tokens available
            </p>
          </div>
          <p className="text-4xl font-bold text-green-600">{mamaBalance}</p>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {redemptionItems.map((item) => {
          const canRedeem = mamaBalance >= item.cost;
          const isSelected = selectedId === item.id;

          return (
            <Card key={item.id} hover={canRedeem} className={canRedeem ? '' : 'opacity-60'}>
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{item.icon}</div>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {item.cost} MAMA
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                  <div className="space-y-2 mt-4 text-sm text-gray-500">
                    <p>👤 {item.provider}</p>
                    <p>📁 {item.category}</p>
                  </div>
                </div>
                <Button
                  variant={canRedeem ? 'primary' : 'secondary'}
                  disabled={!canRedeem}
                  isLoading={isSelected}
                  onClick={() => handleRedeem(item.id)}
                  className="w-full"
                >
                  {isSelected ? 'Processing...' : canRedeem ? 'Redeem Now' : 'Not Enough Tokens'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="space-y-3">
          <p className="font-semibold text-gray-900">💡 Redemption Tips</p>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>✓ Compare options to find the best value for your tokens</li>
            <li>✓ Redemptions are processed within 24-48 hours</li>
            <li>✓ Contact our support if you have any issues</li>
            <li>✓ Keep earning tokens to unlock more services</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
