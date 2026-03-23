'use-client';

import apiClient from '../apiClient';

export interface WalletAddressResponse {
    stellarAddress: string;
}

export interface WalletBalanceResponse {
    xlmBalance: string;
    mamaBalance: string;
}

export interface WalletDataResponse {
    xlmBalance: string;
    mamaBalance: string;
    stellarAddress: string;
}

export interface CreateWalletResponse {
    success: boolean;
    publicKey: string;
    secretKey: string;
    message: string;
    stellarExpert: string;
}

export interface ImportWalletResponse {
    success: boolean;
    publicKey: string;
    message: string;
}


export const walletApi = {
    getWalletAddress: async (): Promise<WalletAddressResponse> => {
        const response = await apiClient.get('/wallet/balance');
        return { stellarAddress: response.data.stellarAddress };
    },

    getWalletBalance: async (): Promise<WalletBalanceResponse> => {
        const response = await apiClient.get('/wallet/balance');
        return { xlmBalance: response.data.xlmBalance, mamaBalance: response.data.mamaBalance };
    },

    getWalletData: async (): Promise<WalletDataResponse> => {
        const response = await apiClient.get('/wallet/balance');
        return {
            xlmBalance: response.data.xlmBalance,
            mamaBalance: response.data.mamaBalance,
            stellarAddress: response.data.stellarAddress
        };
    },

    createWallet: async (): Promise<CreateWalletResponse> => {
        const response = await apiClient.post('/wallet/create');
        return response.data;
    },

    importWallet: async (secretKey: string): Promise<ImportWalletResponse> => {
        const response = await apiClient.post('/wallet/import', { secretKey });
        return response.data;
    },

    getTransactions: async () => {
        const response = await apiClient.get('/wallet/transactions'); // FIXED
        return response.data;
    },

    getSecretKey: async () => {
        const response = await apiClient.get('/wallet/secret-key');
        return response.data;
    },
}