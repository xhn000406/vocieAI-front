import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PersonalLayoutProps {
  children: React.ReactNode;
}

/**
 * Personal 布局
 * 个人中心页面的布局配置
 */
export default function PersonalLayout({ children }: PersonalLayoutProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
