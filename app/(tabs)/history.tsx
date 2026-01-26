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
import { useTheme } from '@/contexts/ThemeContext';
import { storage } from '@/utils/storage';
import { Meeting } from '@/types';
import { formatDate, formatTime } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    const allMeetings = await storage.getMeetings();
    setMeetings(allMeetings);
  };

  const allTags = Array.from(
    new Set(meetings.flatMap((m) => m.tags))
  ).filter(Boolean);

  const filteredMeetings = meetings.filter((meeting) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        meeting.title.toLowerCase().includes(query) ||
        meeting.summary?.summary.toLowerCase().includes(query) ||
        meeting.transcript.some((t) => t.text.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    if (selectedTags.length > 0) {
      const hasTag = selectedTags.some((tag) => meeting.tags.includes(tag));
      if (!hasTag) return false;
    }

    return !meeting.isArchived;
  });

  // 按日期分组
  const groupedMeetings = filteredMeetings.reduce((acc, meeting) => {
    const date = formatDate(meeting.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          历史记录
        </Text>
      </View>

      {/* 搜索栏 */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="search" size={20} color={theme.colors.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="搜索会议..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* 标签筛选 */}
      {allTags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          contentContainerStyle={styles.tagsContent}
        >
          {allTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => toggleTag(tag)}
              style={[
                styles.tag,
                {
                  backgroundColor: selectedTags.includes(tag)
                    ? theme.colors.primary
                    : theme.colors.tagColors.default,
                },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  {
                    color: selectedTags.includes(tag)
                      ? '#ffffff'
                      : theme.colors.tagColors.text,
                  },
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(groupedMeetings).length > 0 ? (
          Object.keys(groupedMeetings).map((date) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[styles.dateLabel, { color: theme.colors.textSecondary }]}>
                {date}
              </Text>
              {groupedMeetings[date].map((meeting) => (
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
                    <View style={styles.meetingMeta}>
                      <Ionicons name="time-outline" size={14} color={theme.colors.textTertiary} />
                      <Text style={[styles.metaText, { color: theme.colors.textTertiary }]}>
                        {formatTime(meeting.duration)}
                      </Text>
                    </View>
                  </View>

                  {meeting.summary?.keywords && meeting.summary.keywords.length > 0 && (
                    <View style={styles.keywords}>
                      {meeting.summary.keywords.slice(0, 5).map((keyword, index) => (
                        <View
                          key={index}
                          style={[
                            styles.keyword,
                            { backgroundColor: theme.colors.tagColors.default },
                          ]}
                        >
                          <Text
                            style={[
                              styles.keywordText,
                              { color: theme.colors.tagColors.text },
                            ]}
                          >
                            {keyword}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {searchQuery || selectedTags.length > 0
                ? '没有找到相关会议'
                : '还没有历史记录'}
            </Text>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsContent: {
    paddingHorizontal: 20,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
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
    marginBottom: 12,
  },
  meetingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  meetingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keyword: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  keywordText: {
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
  },
});

