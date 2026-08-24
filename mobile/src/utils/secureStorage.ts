import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'liptalk_auth_token';
const USER_KEY = 'liptalk_auth_user';

export const secureStorage = {
  async saveToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(TOKEN_KEY, token);
        }
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (e) {
      console.warn('Failed to save auth token securely', e);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(TOKEN_KEY);
        }
        return null;
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (e) {
      console.warn('Failed to retrieve auth token', e);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (e) {
      console.warn('Failed to remove auth token', e);
    }
  },

  async saveUser(user: any): Promise<void> {
    try {
      const data = JSON.stringify(user);
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(USER_KEY, data);
        }
      } else {
        await SecureStore.setItemAsync(USER_KEY, data);
      }
    } catch (e) {
      console.warn('Failed to save user data', e);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      let data: string | null = null;
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          data = window.localStorage.getItem(USER_KEY);
        }
      } else {
        data = await SecureStore.getItemAsync(USER_KEY);
      }
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to retrieve user data', e);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (e) {
      console.warn(`Failed to save item ${key}`, e);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn(`Failed to retrieve item ${key}`, e);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (e) {
      console.warn(`Failed to remove item ${key}`, e);
    }
  },

  async clearAll(): Promise<void> {
    await this.removeToken();
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(USER_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } catch (e) {
      console.warn('Failed to clear user data', e);
    }
  },
};
