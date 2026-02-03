import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/**
 * 404 页面布局
 * 当路由未找到时显示的页面
 */
export default function NotFoundScreen() {
  const handleGoHome = () => {
    // 在这里添加返回首页的逻辑
    console.log('返回首页');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>抱歉，找不到这个页面</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoHome}>
        <Text style={styles.buttonText}>返回首页</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
