import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useTheme } from '@/contexts/ThemeContext';
import { storage } from '@/utils/storage';
import { Meeting, RecordingState, TranscriptItem } from '@/types';
import { formatTime } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

export default function RecordingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>({
    status: 'idle',
    duration: 0,
    transcript: [],
  });
  const [title, setTitle] = useState('无标题会议');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopRecording();
    };
  }, []);

  useEffect(() => {
    if (recordingState.status === 'recording') {
      intervalRef.current = setInterval(() => {
        setRecordingState((prev) => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [recordingState.status]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限被拒绝', '需要麦克风权限才能录音');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setRecordingState({
        status: 'recording',
        startTime: new Date(),
        duration: 0,
        transcript: [],
      });

      // 模拟实时转写（实际应该通过Socket.io接收）
      simulateTranscript();
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('错误', '启动录音失败');
    }
  };

  const simulateTranscript = () => {
    // 模拟每3秒添加一条转写内容
    const mockTranscripts = [
      '大家好，今天我们来讨论一下项目的进展情况。',
      '目前我们已经完成了第一阶段的功能开发。',
      '接下来需要重点关注用户体验的优化。',
      '我建议在下周进行一次用户测试。',
    ];

    let index = 0;
    const transcriptInterval = setInterval(() => {
      if (recordingState.status !== 'recording') {
        clearInterval(transcriptInterval);
        return;
      }

      if (index < mockTranscripts.length) {
        const newItem: TranscriptItem = {
          id: Date.now().toString(),
          timestamp: recordingState.duration,
          text: mockTranscripts[index],
        };

        setRecordingState((prev) => ({
          ...prev,
          transcript: [...prev.transcript, newItem],
        }));

        // 滚动到底部
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        index++;
      }
    }, 3000);
  };

  const pauseRecording = async () => {
    if (!recording) return;

    try {
      await recording.pauseAsync();
      setRecordingState((prev) => ({ ...prev, status: 'paused' }));
    } catch (err) {
      console.error('Failed to pause recording', err);
    }
  };

  const resumeRecording = async () => {
    if (!recording) return;

    try {
      await recording.startAsync();
      setRecordingState((prev) => ({ ...prev, status: 'recording' }));
    } catch (err) {
      console.error('Failed to resume recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setRecordingState((prev) => ({ ...prev, status: 'stopped' }));

      // 保存会议记录
      await saveMeeting(uri || '');
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const saveMeeting = async (audioUrl: string) => {
    const meeting: Meeting = {
      id: Date.now().toString(),
      title,
      createdAt: recordingState.startTime || new Date(),
      duration: recordingState.duration,
      audioUrl,
      transcript: recordingState.transcript,
      summary: {
        keywords: ['项目', '开发', '用户体验'],
        summary: '讨论了项目进展和下一步计划',
        todos: [],
        lastUpdated: new Date(),
      },
      tags: [],
      isArchived: false,
    };

    await storage.addMeeting(meeting);
    router.replace(`/meeting-detail/${meeting.id}`);
  };

  const handleHighlight = (itemId: string) => {
    setRecordingState((prev) => ({
      ...prev,
      transcript: prev.transcript.map((item) =>
        item.id === itemId ? { ...item, isHighlighted: !item.isHighlighted } : item
      ),
    }));
  };

  const handleFinish = () => {
    Alert.alert('结束会议', '确定要结束并保存会议吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: stopRecording },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 顶部标题栏 */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity
          onPress={() => {
            if (recordingState.status === 'recording') {
              Alert.alert('提示', '正在录音中，确定要退出吗？', [
                { text: '取消', style: 'cancel' },
                { text: '确定', onPress: () => router.back() },
              ]);
            } else {
              router.back();
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        {isEditingTitle ? (
          <TextInput
            style={[styles.titleInput, { color: theme.colors.text }]}
            value={title}
            onChangeText={setTitle}
            onBlur={() => setIsEditingTitle(false)}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            onPress={() => setIsEditingTitle(true)}
            style={styles.titleContainer}
          >
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {title}
            </Text>
            <Ionicons name="pencil" size={16} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* 录音波形区域 */}
      {recordingState.status === 'recording' && (
        <View style={styles.waveformContainer}>
          <View style={styles.waveform}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  {
                    backgroundColor: theme.colors.primary,
                    height: Math.random() * 40 + 10,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* 实时转写区域 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.transcriptContainer}
        contentContainerStyle={styles.transcriptContent}
        showsVerticalScrollIndicator={false}
      >
        {recordingState.transcript.length === 0 ? (
          <View style={styles.emptyTranscript}>
            <Ionicons name="mic-outline" size={48} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {recordingState.status === 'recording'
                ? '正在录音，转写内容将实时显示...'
                : '点击开始按钮开始录音'}
            </Text>
          </View>
        ) : (
          recordingState.transcript.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.transcriptItem,
                {
                  backgroundColor: item.isHighlighted
                    ? theme.colors.accentYellow + '20'
                    : 'transparent',
                },
              ]}
              onLongPress={() => handleHighlight(item.id)}
            >
              <View style={styles.transcriptHeader}>
                <Text style={[styles.timestamp, { color: theme.colors.textTertiary }]}>
                  {formatTime(item.timestamp)}
                </Text>
                {item.isHighlighted && (
                  <Ionicons name="star" size={16} color={theme.colors.accentYellow} />
                )}
              </View>
              <Text style={[styles.transcriptText, { color: theme.colors.text }]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* AI总结卡片 */}
      {recordingState.transcript.length > 0 && recordingState.transcript.length % 3 === 0 && (
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="bulb" size={20} color={theme.colors.accentYellow} />
          <Text style={[styles.summaryText, { color: theme.colors.text }]}>
            小结：已记录 {recordingState.transcript.length} 条转写内容
          </Text>
        </View>
      )}

      {/* 底部控制栏 */}
      <View style={[styles.controls, { backgroundColor: theme.colors.card }]}>
        <View style={styles.controlsTop}>
          <Text style={[styles.duration, { color: theme.colors.text }]}>
            {formatTime(recordingState.duration)}
          </Text>
          <View style={styles.controlButtons}>
            {recordingState.status === 'idle' && (
              <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
                <LinearGradient
                  colors={theme.colors.primaryGradient}
                  style={styles.recordButtonGradient}
                >
                  <Ionicons name="mic" size={24} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
            )}

            {recordingState.status === 'recording' && (
              <>
                <TouchableOpacity onPress={pauseRecording} style={styles.controlButton}>
                  <Ionicons name="pause" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
                  <LinearGradient
                    colors={[theme.colors.error, '#dc2626']}
                    style={styles.finishButtonGradient}
                  >
                    <Ionicons name="stop" size={24} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {recordingState.status === 'paused' && (
              <>
                <TouchableOpacity onPress={resumeRecording} style={styles.controlButton}>
                  <Ionicons name="play" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
                  <LinearGradient
                    colors={[theme.colors.error, '#dc2626']}
                    style={styles.finishButtonGradient}
                  >
                    <Ionicons name="checkmark" size={24} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  waveformContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  waveBar: {
    width: 3,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  transcriptContainer: {
    flex: 1,
  },
  transcriptContent: {
    padding: 20,
  },
  emptyTranscript: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  transcriptItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  transcriptText: {
    fontSize: 16,
    lineHeight: 24,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  controls: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  controlsTop: {
    alignItems: 'center',
  },
  duration: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  recordButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  finishButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  finishButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

