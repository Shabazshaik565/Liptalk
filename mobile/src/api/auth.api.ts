import { apiClient } from './client';
import { CURRENT_USER } from './mockData';
import { User, UserRole } from '../types';

export const authApi = {
  login: async (identifier: string, password?: string): Promise<{ user: User; token: string }> => {
    try {
      const res = await apiClient.post('/auth/login', { identifier, password });
      return res.data;
    } catch {
      // Offline / Demo fallback
      return {
        user: { ...CURRENT_USER, email: identifier.includes('@') ? identifier : CURRENT_USER.email },
        token: 'demo_mock_jwt_token_alex_morgan',
      };
    }
  },

  register: async (data: { email: string; phone?: string; role: UserRole }): Promise<{ user: User; token: string }> => {
    try {
      const res = await apiClient.post('/auth/register', data);
      return res.data;
    } catch {
      return {
        user: {
          ...CURRENT_USER,
          email: data.email,
          role: data.role,
          needsOnboarding: true,
        },
        token: 'demo_mock_jwt_token_new_user',
      };
    }
  },

  sendOtp: async (phone: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await apiClient.post('/auth/otp/send', { phone });
      return res.data;
    } catch {
      return { success: true, message: 'OTP 123456 sent successfully to ' + phone };
    }
  },

  verifyOtp: async (phone: string, otp: string): Promise<{ user: User; token: string }> => {
    try {
      const res = await apiClient.post('/auth/otp/verify', { phone, otp });
      return res.data;
    } catch {
      return {
        user: { ...CURRENT_USER, phoneNumber: phone, isPhoneVerified: true },
        token: 'demo_mock_jwt_token_verified',
      };
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const res = await apiClient.get('/users/me');
      return res.data;
    } catch {
      return CURRENT_USER;
    }
  },
};
