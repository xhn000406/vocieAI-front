import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    checkInitialRoute();
  }, [isLoading]);

  const checkInitialRoute = async () => {
    if (isLoading) return;

    const isOnboarded = await storage.getIsOnboarded();
    
    if (!isOnboarded) {
      router.replace('/onboarding');
    } else if (!user) {
      router.replace('/auth');
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.primaryGradient}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </LinearGradient>
  );
}

