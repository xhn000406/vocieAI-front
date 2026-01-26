import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meeting } from '@/types';

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  MEETINGS: 'meetings',
  IS_ONBOARDED: 'is_onboarded',
  THEME: 'theme',
};

export const storage = {
  // 用户信息
  async getUser() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  
  async saveUser(user: any) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  
  // Token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  },
  
  async saveToken(token: string | null) {
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  },
  
  // 会议记录
  async getMeetings(): Promise<Meeting[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MEETINGS);
    return data ? JSON.parse(data) : [];
  },
  
  async saveMeetings(meetings: Meeting[]) {
    await AsyncStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
  },
  
  async addMeeting(meeting: Meeting) {
    const meetings = await this.getMeetings();
    meetings.unshift(meeting);
    await this.saveMeetings(meetings);
  },
  
  async updateMeeting(id: string, updates: Partial<Meeting>) {
    const meetings = await this.getMeetings();
    const index = meetings.findIndex(m => m.id === id);
    if (index !== -1) {
      meetings[index] = { ...meetings[index], ...updates };
      await this.saveMeetings(meetings);
    }
  },
  
  async deleteMeeting(id: string) {
    const meetings = await this.getMeetings();
    const filtered = meetings.filter(m => m.id !== id);
    await this.saveMeetings(filtered);
  },
  
  // 引导页
  async getIsOnboarded(): Promise<boolean> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.IS_ONBOARDED);
    return data === 'true';
  },
  
  async setIsOnboarded(value: boolean) {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_ONBOARDED, String(value));
  },
  
  // 主题
  async getTheme(): Promise<'light' | 'dark' | 'auto'> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return (data as 'light' | 'dark' | 'auto') || 'auto';
  },
  
  async setTheme(theme: 'light' | 'dark' | 'auto') {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
};

