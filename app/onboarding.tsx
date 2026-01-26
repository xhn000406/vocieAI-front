import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { storage } from '@/utils/storage';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'AI 实时总结会议',
    description: '智能语音转写，自动生成会议摘要和关键信息',
    icon: '💡',
  },
  {
    title: '支持多人发言识别',
    description: '自动区分不同发言人，让会议记录更清晰',
    icon: '👥',
  },
  {
    title: '一键导出笔记',
    description: '支持导出PDF、Markdown，同步到飞书、Notion等',
    icon: '📤',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({
        x: nextPage * width,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await storage.setIsOnboarded(true);
    router.replace('/auth');
  };

  const handleSkip = () => {
    handleFinish();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentPage(page);
        }}
      >
        {onboardingData.map((item, index) => (
          <View key={index} style={[styles.page, { width }]}>
            <View style={styles.content}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentPage
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          {currentPage < onboardingData.length - 1 && (
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButton}
            >
              <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>
                跳过
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <LinearGradient
              colors={theme.colors.primaryGradient}
              style={styles.gradientButton}
            >
              <Text style={styles.nextText}>
                {currentPage === onboardingData.length - 1 ? '开始使用' : '下一步'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    fontSize: 16,
  },
  nextButton: {
    flex: 1,
    marginLeft: 16,
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

