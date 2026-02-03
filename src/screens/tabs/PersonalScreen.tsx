import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

/**
 * 个人中心业务实现
 */
export default function PersonalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>个人中心</Text>
        <Text style={styles.subtitle}>管理你的账户和设置</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>账户信息</Text>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>用户名</Text>
            <Text style={styles.itemValue}>用户</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>邮箱</Text>
            <Text style={styles.itemValue}>user@example.com</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设置</Text>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>通知设置</Text>
            <Text style={styles.itemValue}>已开启</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>语言</Text>
            <Text style={styles.itemValue}>简体中文</Text>
          </View>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLabel: {
    fontSize: 16,
    color: '#666',
  },
  itemValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
