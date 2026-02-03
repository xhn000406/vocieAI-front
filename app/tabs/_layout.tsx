import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import HomeTab from './home';
import SearchTab from './search';
import PersonalTab from './personal';

const Tab = createBottomTabNavigator();

/**
 * Tabs 布局
 * 底部标签栏导航配置
 */
export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeTab}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="search"
        component={SearchTab}
        options={{
          tabBarLabel: '搜索',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="personal"
        component={PersonalTab}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
