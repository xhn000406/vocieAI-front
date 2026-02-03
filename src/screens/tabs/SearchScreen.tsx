import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * 搜索页面业务实现
 */
export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>搜索</Text>
        <Text style={styles.subtitle}>搜索你想要的内容</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>搜索功能待实现...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
});
