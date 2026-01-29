// 全局类型定义

export interface User {
  id: string;
  name: string;
  email?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};
