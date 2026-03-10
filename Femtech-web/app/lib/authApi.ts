import apiClient from './apiClient';

export interface OtpRequestResponse {
    success: boolean;
    message: string;
}

export interface OtpVerifyResponse {
    success: boolean;
    token: string;
    message: string;
    users: {
        id: string;
        phone: string;
        country: string;
    }
}

export interface CurrentUserResponse {
    id: string;
    phone: string;
    country: string;
    email?: string;
    name?: string;
}

export const authApi = {
    requestOtp: async (phone: string, country: string): Promise<OtpRequestResponse> => {
        const response = await apiClient.post('auth/otp/request', { phone, country });
        return response.data;
    },

    verifyOtp: async (phone: string, otp: string): Promise<OtpVerifyResponse> => {
        const response = await apiClient.post('auth/otp/verify', { phone, otp });
        return response.data;
    },

    getCurrentUser: async (): Promise<CurrentUserResponse> => {
        const response = await apiClient.get('auth/me');
        return response.data;
    },

    logOut: async (): Promise<void> => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    },
}