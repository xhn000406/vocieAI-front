import React, { useEffect, useRef, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { DefaultTheme, ThemeProvider, useNavigationContainerRef } from '@react-navigation/native';
import TabsLayout from './tabs/_layout';
import LoginIndex from './login/index';
import PersonalIndex from './personal/index';
import NotFoundScreen from './+not-found';

const Stack = createStackNavigator();

// 禁用字体缩放
(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  allowFontScaling: false,
};

(TextInput as any).defaultProps = {
  ...(TextInput as any).defaultProps,
  allowFontScaling: false,
};

// 定义需要白色状态栏的路由名
const whiteStatusBarRoutes = ['tabs'];

function StackNavigator() {
  const [statusBarStyle, setStatusBarStyle] = useState<'auto' | 'inverted' | 'light' | 'dark'>('auto');
  const [statusBarHidden, setStatusBarHidden] = useState(false);
  const navigationRef = useNavigationContainerRef();
  const prevRouteNameRef = useRef<string>('');

  // 监听路由变化，更新状态栏样式
  useEffect(() => {
    if (!navigationRef.current) return;

    const unsubscribe = navigationRef.current.addListener('state', () => {
      const currentRouteName = navigationRef.current?.getCurrentRoute()?.name || '';
      
      if (whiteStatusBarRoutes.includes(currentRouteName)) {
        setStatusBarStyle('light');
      } else {
        setStatusBarStyle('dark');
      }

      // 记录路由变化（可用于统计等）
      if (prevRouteNameRef.current !== currentRouteName) {
        console.log('路由变化:', prevRouteNameRef.current, '->', currentRouteName);
        prevRouteNameRef.current = currentRouteName;
      }
    });

    return unsubscribe;
  }, [navigationRef]);

  return (
    <>
      {/* 顶部状态栏 */}
      <StatusBar
        style={statusBarStyle}
        hidden={statusBarHidden}
        translucent={true}
        backgroundColor="transparent"
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
        initialRouteName="tabs"
      >
        <Stack.Screen name="tabs" component={TabsLayout} />
        <Stack.Screen name="login" component={LoginIndex} />
        <Stack.Screen name="personal" component={PersonalIndex} />
        <Stack.Screen name="+not-found" component={NotFoundScreen} />
      </Stack.Navigator>
    </>
  );
}

/**
 * 根布局组件
 * 这是应用的根布局，用于配置全局的布局设置
 * 可以在这里添加全局的导航栏、状态栏、主题等配置
 */
export default function RootLayout() {
  return (
    <View style={styles.container}>
      <ThemeProvider value={DefaultTheme}>
        <StackNavigator />
        {/* 这里可以添加全局组件，如 Toast、Modal、Loading 等 */}
        {/* <GlobalToastGroup /> */}
        {/* <GlobalConfirmModal /> */}
        {/* <GlobalLoading /> */}
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
