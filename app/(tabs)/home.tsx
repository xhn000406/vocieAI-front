import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { storage } from '@/utils/storage';
import { Meeting } from '@/types';
import { formatRelativeTime, formatTime } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    const allMeetings = await storage.getMeetings();
    setMeetings(allMeetings.slice(0, 5)); // 只显示最近5条
  };

  const handleStartMeeting = () => {
    router.push('/recording');
  };

  const filteredMeetings = meetings.filter((meeting) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      meeting.title.toLowerCase().includes(query) ||
      meeting.summary?.summary.toLowerCase().includes(query) ||
      meeting.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          今日会议
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          {meetings.length} 条记录
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 快速开始按钮 */}
        <TouchableOpacity onPress={handleStartMeeting} style={styles.startButton}>
          <LinearGradient
            colors={theme.colors.primaryGradient}
            style={styles.startButtonGradient}
          >
            <View style={styles.startButtonContent}>
              <Ionicons name="mic" size={32} color="#ffffff" />
              <Text style={styles.startButtonText}>开始新会议</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* 搜索栏 */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search" size={20} color={theme.colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="搜索会议记录..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* 最近会议列表 */}
        {filteredMeetings.length > 0 ? (
          <View style={styles.meetingsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              最近会议
            </Text>
            {filteredMeetings.map((meeting) => (
              <TouchableOpacity
                key={meeting.id}
                style={[styles.meetingCard, { backgroundColor: theme.colors.card }]}
                onPress={() => router.push(`/meeting-detail/${meeting.id}`)}
              >
                <View style={styles.meetingCardHeader}>
                  <Text
                    style={[styles.meetingTitle, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {meeting.title || '无标题会议'}
                  </Text>
                  <Text style={[styles.meetingTime, { color: theme.colors.textSecondary }]}>
                    {formatRelativeTime(meeting.createdAt)}
                  </Text>
                </View>

                {meeting.summary?.summary && (
                  <Text
                    style={[styles.meetingSummary, { color: theme.colors.textSecondary }]}
                    numberOfLines={2}
                  >
                    {meeting.summary.summary}
                  </Text>
                )}

                <View style={styles.meetingCardFooter}>
                  <View style={styles.meetingMeta}>
                    <Ionicons name="time-outline" size={14} color={theme.colors.textTertiary} />
                    <Text style={[styles.metaText, { color: theme.colors.textTertiary }]}>
                      {formatTime(meeting.duration)}
                    </Text>
                  </View>

                  {meeting.tags.length > 0 && (
                    <View style={styles.tags}>
                      {meeting.tags.slice(0, 3).map((tag, index) => (
                        <View
                          key={index}
                          style={[
                            styles.tag,
                            {
                              backgroundColor: theme.colors.tagColors.default,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tagText,
                              { color: theme.colors.tagColors.text },
                            ]}
                          >
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {searchQuery ? '没有找到相关会议' : '还没有会议记录'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                onPress={handleStartMeeting}
                style={[styles.emptyButton, { borderColor: theme.colors.primary }]}
              >
                <Text style={[styles.emptyButtonText, { color: theme.colors.primary }]}>
                  开始第一个会议
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  startButton: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonGradient: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  startButtonContent: {
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  meetingsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  meetingCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  meetingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meetingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  meetingTime: {
    fontSize: 12,
  },
  meetingSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  meetingCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meetingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 6,
  },
  tagText: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

