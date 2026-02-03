import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

interface ListItem {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}

export default function ListDemoScreen() {
  const [items, setItems] = useState<ListItem[]>([
    {
      id: '1',
      title: '项目 1',
      subtitle: '这是第一个列表项',
      color: '#FF6B6B',
    },
    {
      id: '2',
      title: '项目 2',
      subtitle: '这是第二个列表项',
      color: '#4ECDC4',
    },
    {
      id: '3',
      title: '项目 3',
      subtitle: '这是第三个列表项',
      color: '#45B7D1',
    },
    {
      id: '4',
      title: '项目 4',
      subtitle: '这是第四个列表项',
      color: '#FFA07A',
    },
    {
      id: '5',
      title: '项目 5',
      subtitle: '这是第五个列表项',
      color: '#98D8C8',
    },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const newItem: ListItem = {
        id: String(items.length + 1),
        title: `项目 ${items.length + 1}`,
        subtitle: `新添加的列表项`,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][
          items.length % 5
        ],
      };
      setItems([newItem, ...items]);
      setRefreshing(false);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const renderItem = ({ item }: { item: ListItem }) => (
    <View style={styles.item}>
      <View style={[styles.colorBar, { backgroundColor: item.color }]} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteText}>删除</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>列表Demo</Text>
      <Text style={styles.subtitle}>下拉刷新，点击删除</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>列表为空</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingBottom: 16,
  },
  list: {
    padding: 16,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
    height: '100%',
  },
  itemContent: {
    flex: 1,
    padding: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
