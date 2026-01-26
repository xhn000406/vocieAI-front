import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, colorScheme, setColorScheme } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const handleLogout = () => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '退出',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth');
        },
      },
    ]);
  };

  const handleThemeToggle = (value: boolean) => {
    setIsDarkMode(value);
    setColorScheme(value ? 'dark' : 'light');
  };

  const menuItems = [
    {
      icon: 'settings-outline',
      title: '设置',
      onPress: () => Alert.alert('提示', '设置功能待实现'),
    },
    {
      icon: 'help-circle-outline',
      title: '帮助中心',
      onPress: () => Alert.alert('提示', '帮助中心待实现'),
    },
    {
      icon: 'document-text-outline',
      title: '隐私政策',
      onPress: () => Alert.alert('提示', '隐私政策待实现'),
    },
    {
      icon: 'information-circle-outline',
      title: '关于',
      onPress: () => Alert.alert('关于', '笔记 v1.0.0\nAI实时语音转写应用'),
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 用户信息卡片 */}
      <View style={[styles.userCard, { backgroundColor: theme.colors.card }]}>
        <LinearGradient
          colors={theme.colors.primaryGradient}
          style={styles.avatarContainer}
        >
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          )}
        </LinearGradient>
        <Text style={[styles.userName, { color: theme.colors.text }]}>
          {user?.name || '用户'}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
          {user?.email || '未绑定邮箱'}
        </Text>

        {/* 账户状态 */}
        <View style={styles.subscriptionBadge}>
          <LinearGradient
            colors={
              user?.subscription === 'pro'
                ? theme.colors.primaryGradient
                : ['#9ca3af', '#6b7280']
            }
            style={styles.badgeGradient}
          >
            <Text style={styles.badgeText}>
              {user?.subscription === 'pro' ? 'Pro 会员' : '免费版'}
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* 云同步状态 */}
      <View style={[styles.syncCard, { backgroundColor: theme.colors.card }]}>
        <View style={styles.syncHeader}>
          <Ionicons name="cloud-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.syncTitle, { color: theme.colors.text }]}>
            云同步
          </Text>
        </View>
        <Text style={[styles.syncText, { color: theme.colors.textSecondary }]}>
          上次同步：{user?.lastSyncAt ? '刚刚' : '从未同步'}
        </Text>
        <Text style={[styles.syncText, { color: theme.colors.textSecondary }]}>
          存储用量：{user?.storageUsed || 0} MB / 1 GB
        </Text>
      </View>

      {/* 主题设置 */}
      <View style={[styles.settingsCard, { backgroundColor: theme.colors.card }]}>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={20} color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>
              深色模式
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeToggle}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View>
      </View>

      {/* 会员订阅 */}
      {user?.subscription !== 'pro' && (
        <TouchableOpacity
          style={styles.subscribeCard}
          onPress={() => Alert.alert('提示', '会员订阅功能待实现')}
        >
          <LinearGradient
            colors={theme.colors.primaryGradient}
            style={styles.subscribeGradient}
          >
            <Text style={styles.subscribeTitle}>升级到 Pro</Text>
            <Text style={styles.subscribeSubtitle}>
              解锁更多功能：更长录音时长、高精度转写、多人识别等
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* 菜单项 */}
      <View style={[styles.menuCard, { backgroundColor: theme.colors.card }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              },
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon as any} size={20} color={theme.colors.text} />
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                {item.title}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 退出登录 */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  userCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 16,
  },
  subscriptionBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  syncCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  syncText: {
    fontSize: 14,
    marginTop: 4,
  },
  settingsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  subscribeCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  subscribeGradient: {
    padding: 20,
    alignItems: 'center',
  },
  subscribeTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  subscribeSubtitle: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
  menuCard: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

