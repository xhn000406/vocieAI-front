import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * 登录页面业务实现
 * 具体的登录逻辑和 UI 实现
 */
export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>登录页面</Text>
      <Text style={styles.subtitle}>在这里实现登录相关的业务逻辑</Text>
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
