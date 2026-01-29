import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * 首页
 * 这是应用的入口页面
 */
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>欢迎使用 Voice AI App</Text>
      <Text style={styles.subtitle}>从这里开始你的应用之旅</Text>
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
