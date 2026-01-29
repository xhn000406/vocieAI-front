import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * 个人中心页面业务实现
 * 具体的个人中心逻辑和 UI 实现
 */
export default function PersonalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>个人中心</Text>
      <Text style={styles.subtitle}>在这里实现个人中心相关的业务逻辑</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
