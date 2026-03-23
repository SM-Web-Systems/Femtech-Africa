'use client';

import { Partner } from '../../lib/hooks/usePartnerDetails';

interface PartnerProps {
    partner: Partner;
}

export default function PartnerItem({ partner }: PartnerProps) {
    return (
        <div className="p-3 rounded text-sm">
            <div className="flex justify-between items-center mb-1  text-gray-900">
                <span className="font-semibold">{partner.name}</span>
                <span className="text-xs opacity-75 ">{partner.country}</span>
                <span className="text-xs opacity-75 ">{partner.type}</span>
            </div >
            <p className="text-xs opacity-75  text-gray-900">{partner.description}</p>
        </div >
    );
}