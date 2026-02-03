import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootLayout from './app/_layout';

/**
 * 应用入口
 * 使用 app 文件夹中的布局和页面
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootLayout />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
