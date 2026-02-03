import React from 'react';
import { StyleSheet, View } from 'react-native';

interface LoginLayoutProps {
  children: React.ReactNode;
}

/**
 * Login 布局
 * 登录页面的布局配置
 */
export default function LoginLayout({ children }: LoginLayoutProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
