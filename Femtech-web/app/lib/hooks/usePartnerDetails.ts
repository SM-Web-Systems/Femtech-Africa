'use client';

import { useState, useEffect } from 'react';
import { redemptionsApi } from '../services/useRedemptions';

export interface Partner {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    type: string;
    country: string;
}

export interface UsePartnerDetailsReturn {
    partners: Partner[] | null;
    loading: boolean;
    error: string | null;
}

export const usePartnerDetails = (): UsePartnerDetailsReturn => {
    const [partners, setPartners] = useState<Partner[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await redemptionsApi.getPartners();
                console.log('API response for partners:', response);
                setPartners(response);
            } catch (err) {
                console.error('Failed to fetch partners:', err);
                setError(err instanceof Error ? err.message : 'Failed to load partners. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchPartners();

        console.log('Partners fetched:', partners?.length);
    }, []);

    return { partners, loading, error }

}