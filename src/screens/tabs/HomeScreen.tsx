import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * 首页业务实现
 */
export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>首页</Text>
        <Text style={styles.subtitle}>欢迎使用 Voice AI App</Text>
      </View>
      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('whisper' as never)}
          activeOpacity={0.7}
        >
          <Text style={styles.cardTitle}>🎤 语音识别</Text>
          <Text style={styles.cardDescription}>
            使用 Whisper 进行离线语音转文字
          </Text>
          <Text style={styles.cardArrow}>→</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>功能卡片 2</Text>
          <Text style={styles.cardDescription}>可以在这里添加更多功能</Text>
        </View>
      </ScrollView>
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
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  cardArrow: {
    fontSize: 20,
    color: '#007AFF',
    position: 'absolute',
    right: 20,
    top: 20,
  },
});
