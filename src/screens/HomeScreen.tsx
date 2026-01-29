import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface HomeScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const demos = [
    { id: 'form', title: '表单Demo', description: '各种表单输入组件示例' },
    { id: 'list', title: '列表Demo', description: '列表展示和交互示例' },
    { id: 'animation', title: '动画Demo', description: '动画效果示例' },
    { id: 'button', title: '按钮交互Demo', description: '按钮交互效果示例' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Demo 页面集合</Text>
        <Text style={styles.subtitle}>选择下面的demo查看效果</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {demos.map((demo) => (
          <TouchableOpacity
            key={demo.id}
            style={styles.card}
            onPress={() => navigation.navigate(demo.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>{demo.title}</Text>
            <Text style={styles.cardDescription}>{demo.description}</Text>
            <Text style={styles.cardArrow}>→</Text>
          </TouchableOpacity>
        ))}
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
  scrollView: {
    flex: 1,
  },
  content: {
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  cardArrow: {
    fontSize: 24,
    color: '#007AFF',
    marginLeft: 12,
  },
});
