import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { storage } from '@/utils/storage';
import { Meeting } from '@/types';
import { formatDateTime, formatTime } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

export default function MeetingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    loadMeeting();
  }, [id]);

  const loadMeeting = async () => {
    const meetings = await storage.getMeetings();
    const found = meetings.find((m) => m.id === id);
    if (found) {
      setMeeting(found);
      setTitle(found.title);
    }
  };

  const handleSaveTitle = async () => {
    if (!meeting) return;
    setIsEditingTitle(false);
    await storage.updateMeeting(meeting.id, { title });
    setMeeting({ ...meeting, title });
  };

  const handleDelete = () => {
    Alert.alert('删除会议', '确定要删除这个会议记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          await storage.deleteMeeting(meeting!.id);
          router.back();
        },
      },
    ]);
  };

  const handleShare = async () => {
    if (!meeting) return;

    try {
      const summary = meeting.summary
        ? `关键词：${meeting.summary.keywords.join('、')}\n摘要：${meeting.summary.summary}`
        : '无摘要';
      await Share.share({
        message: `${meeting.title}\n\n${summary}\n\n时长：${formatTime(meeting.duration)}`,
      });
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  const handleExport = (format: 'pdf' | 'markdown') => {
    Alert.alert('导出', `${format.toUpperCase()}导出功能待实现`);
  };

  if (!meeting) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 顶部标题栏 */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        {isEditingTitle ? (
          <TextInput
            style={[styles.titleInput, { color: theme.colors.text }]}
            value={title}
            onChangeText={setTitle}
            onBlur={handleSaveTitle}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            onPress={() => setIsEditingTitle(true)}
            style={styles.titleContainer}
          >
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {meeting.title || '无标题会议'}
            </Text>
            <Ionicons name="pencil" size={16} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* 时间标签 */}
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.textTertiary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {formatDateTime(meeting.createdAt)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={theme.colors.textTertiary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {formatTime(meeting.duration)}
          </Text>
        </View>
      </View>

      {/* AI总结卡片 */}
      {meeting.summary && (
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            AI 总结
          </Text>

          {meeting.summary.keywords.length > 0 && (
            <View style={styles.keywordsSection}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                📌 关键词：
              </Text>
              <View style={styles.keywords}>
                {meeting.summary.keywords.map((keyword, index) => (
                  <View
                    key={index}
                    style={[
                      styles.keyword,
                      { backgroundColor: theme.colors.tagColors.default },
                    ]}
                  >
                    <Text
                      style={[styles.keywordText, { color: theme.colors.tagColors.text }]}
                    >
                      {keyword}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {meeting.summary.summary && (
            <View style={styles.summarySection}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                📌 摘要：
              </Text>
              <Text style={[styles.summaryText, { color: theme.colors.text }]}>
                {meeting.summary.summary}
              </Text>
            </View>
          )}

          {meeting.summary.todos.length > 0 && (
            <View style={styles.todosSection}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                📌 待办：
              </Text>
              {meeting.summary.todos.map((todo) => (
                <View key={todo.id} style={styles.todoItem}>
                  <Ionicons
                    name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={todo.completed ? theme.colors.success : theme.colors.textTertiary}
                  />
                  <Text
                    style={[
                      styles.todoText,
                      {
                        color: theme.colors.text,
                        textDecorationLine: todo.completed ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {todo.assignee && `@${todo.assignee} `}
                    {todo.text}
                    {todo.dueDate && ` (截止：${formatDateTime(todo.dueDate)})`}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 时间线转写 */}
      <View style={styles.transcriptSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          转写内容
        </Text>
        {meeting.transcript.length > 0 ? (
          meeting.transcript.map((item) => (
            <View
              key={item.id}
              style={[
                styles.transcriptItem,
                {
                  backgroundColor: item.isHighlighted
                    ? theme.colors.accentYellow + '20'
                    : theme.colors.card,
                },
              ]}
            >
              <View style={styles.transcriptHeader}>
                <Text style={[styles.timestamp, { color: theme.colors.textTertiary }]}>
                  {formatTime(item.timestamp)}
                </Text>
                {item.speakerName && (
                  <View
                    style={[
                      styles.speakerTag,
                      { backgroundColor: theme.colors.tagColors.default },
                    ]}
                  >
                    <Text
                      style={[styles.speakerText, { color: theme.colors.tagColors.text }]}
                    >
                      {item.speakerName}
                    </Text>
                  </View>
                )}
                {item.isHighlighted && (
                  <Ionicons name="star" size={16} color={theme.colors.accentYellow} />
                )}
              </View>
              <Text style={[styles.transcriptText, { color: theme.colors.text }]}>
                {item.text}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              暂无转写内容
            </Text>
          </View>
        )}
      </View>

      {/* 操作按钮 */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
          onPress={() => handleExport('pdf')}
        >
          <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>导出PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
          onPress={() => handleExport('markdown')}
        >
          <Ionicons name="code-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>导出MD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#ffffff" />
          <Text style={[styles.actionText, { color: '#ffffff' }]}>删除</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    marginLeft: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 6,
  },
  summaryCard: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  keywordsSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keyword: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    fontSize: 14,
  },
  summarySection: {
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
  },
  todosSection: {
    marginTop: 8,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  todoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  transcriptSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  transcriptItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    marginRight: 8,
  },
  speakerTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  speakerText: {
    fontSize: 12,
  },
  transcriptText: {
    fontSize: 16,
    lineHeight: 24,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
});

