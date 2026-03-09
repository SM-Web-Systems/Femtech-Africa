// D:\SM-WEB\FEMTECH-AFRICA\Femtech-mobile\src\api\profile.ts

import apiClient from './client';

export const profileApi = {
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
    dateOfBirth?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  }) => {
    const response = await apiClient.put('/profile', data);
    return response.data;
  },

  uploadAvatar: async (formData: FormData) => {
    const response = await apiClient.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
