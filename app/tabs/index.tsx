import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import HomeScreen from '../../src/screens/tabs/HomeScreen';

/**
 * Tabs 首页入口
 * 这里引入具体的业务实现
 */
export default function TabsIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tabs 首页</Text>
      <Text style={styles.subtitle}>在这里引入具体的业务实现</Text>
      {/* <HomeScreen /> */}
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
