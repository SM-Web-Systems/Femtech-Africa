'use client';

import { Partner } from '../../lib/hooks/usePartnerDetails';
import { useRouter } from 'next/navigation';

interface PartnerProps {
    partner: Partner;
}

export default function PartnerItem({ partner }: PartnerProps) {
    const router = useRouter();

    function handlePartnerClick() {
        router.push(`/redemptions/${partner.id}`);
    }
    return (
        <div className="p-3 rounded text-sm">
            <div className="flex justify-between items-center mb-1  text-gray-900">
                <span className="font-semibold">{partner.name}</span>
                <span className="text-xs opacity-75 ">{partner.country}</span>
                {partner.type === 'mobile_money' ? (
                    <span className="text-xs opacity-75 ">mobile money</span>
                ) : (
                    <span className="text-xs opacity-75 ">{partner.type}</span>)}
            </div >
            <p className="text-xs opacity-75  text-gray-900">{partner.description}</p>
            <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                onClick={handlePartnerClick}
            >
                Redeem with {partner.name}
            </button>
        </div >
    );
}