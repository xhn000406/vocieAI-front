import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/utils/api';
import { storage } from '@/utils/storage';

export default function AuthScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert('提示', '请输入昵称');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // 登录
        const response: any = await apiClient.post('/auth/login', {
          email: email.toLowerCase(),
          password,
        });

        if (response.success && response.data) {
          // 保存token
          await storage.saveToken(response.data.token);
          
          // 保存用户信息
          const user = {
            id: response.data.user.id.toString(),
            name: response.data.user.name,
            email: response.data.user.email,
            subscription: response.data.user.subscription as 'free' | 'pro',
            storageUsed: 0,
          };

          await login(user);
          router.replace('/(tabs)/home');
        } else {
          Alert.alert('登录失败', response.message || '请检查邮箱和密码');
        }
      } else {
        // 注册
        const response: any = await apiClient.post('/auth/register', {
          email: email.toLowerCase(),
          password,
          name,
        });

        if (response.success && response.data) {
          // 保存token
          await storage.saveToken(response.data.token);
          
          // 保存用户信息
          const user = {
            id: response.data.user.id.toString(),
            name: response.data.user.name,
            email: response.data.user.email,
            subscription: response.data.user.subscription as 'free' | 'pro',
            storageUsed: 0,
          };

          await login(user);
          Alert.alert('注册成功', '欢迎使用！');
          router.replace('/(tabs)/home');
        } else {
          Alert.alert('注册失败', response.message || '请稍后重试');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      const errorMessage = error.response?.data?.message || error.message || '网络错误，请检查网络连接';
      Alert.alert(isLogin ? '登录失败' : '注册失败', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'apple' | 'google' | 'wechat') => {
    Alert.alert('提示', `${provider}登录功能待实现`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {isLogin ? '欢迎回来' : '创建账户'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {isLogin ? '登录以继续使用' : '注册新账户'}
        </Text>

        <View style={styles.form}>
          {!isLogin && (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="昵称"
              placeholderTextColor={theme.colors.textTertiary}
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="邮箱"
            placeholderTextColor={theme.colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="密码"
            placeholderTextColor={theme.colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            onPress={handleSubmit} 
            style={styles.submitButton}
            disabled={loading}
          >
            <LinearGradient
              colors={theme.colors.primaryGradient}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitText}>
                  {isLogin ? '登录' : '注册'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
              或
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => handleSocialLogin('apple')}
            >
              <Text style={styles.socialText}>🍎 Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => handleSocialLogin('google')}
            >
              <Text style={styles.socialText}>🔵 Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => handleSocialLogin('wechat')}
            >
              <Text style={styles.socialText}>💬 微信</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setIsLogin(!isLogin)}
            style={styles.switchButton}
          >
            <Text style={[styles.switchText, { color: theme.colors.primary }]}>
              {isLogin ? '还没有账户？注册' : '已有账户？登录'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '500',
  },
  switchButton: {
    alignItems: 'center',
    padding: 12,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

