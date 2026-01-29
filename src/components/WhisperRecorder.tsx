import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { whisperService } from '../services/whisperService';
import type { WhisperResult } from '../types/whisper';

interface WhisperRecorderProps {
  modelPath: string; // Whisper 模型文件路径
  onTranscriptionComplete?: (result: WhisperResult) => void;
  onError?: (error: Error) => void;
}

/**
 * Whisper 录音和转录组件
 */
export const WhisperRecorder: React.FC<WhisperRecorderProps> = ({
  modelPath,
  onTranscriptionComplete,
  onError,
}) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null); // 保存录音文件 URI
  const [sound, setSound] = useState<Audio.Sound | null>(null); // 播放器实例
  const [isPlaying, setIsPlaying] = useState(false); // 播放状态

  // 初始化 Whisper
  useEffect(() => {
    const initWhisper = async () => {
      if (!modelPath) {
        Alert.alert('错误', '请提供模型文件路径');
        return;
      }

      try {
        setInitializing(true);
        console.log('[WhisperRecorder] 开始初始化，模型路径:', modelPath);

        // Android 上如果路径是 file:///android_asset/，则 isBundleAsset 应该为 false（完整路径）
        // 如果只是文件名，则 isBundleAsset 应该为 true（bundle 资源）
        // iOS 上如果只是文件名，则 isBundleAsset 应该为 true
        const isBundleAsset =
          !modelPath.startsWith('file://') &&
          !modelPath.startsWith('/') &&
          !modelPath.startsWith('file:///android_asset/');

        console.log(
          '[WhisperRecorder] isBundleAsset:',
          isBundleAsset,
          'modelPath:',
          modelPath
        );

        await whisperService.init({
          filePath: modelPath,
          isBundleAsset: isBundleAsset,
        });

        setIsInitialized(true);
        console.log('[WhisperRecorder] 初始化成功');
      } catch (error) {
        console.error('[WhisperRecorder] 初始化错误:', error);
        const err = error instanceof Error ? error : new Error('初始化失败');
        const errorMessage =
          err.message || '初始化失败，请检查模型文件是否存在';
        Alert.alert('初始化失败', errorMessage);
        onError?.(err);
      } finally {
        setInitializing(false);
      }
    };

    initWhisper();

    // 清理函数 - 不在组件卸载时释放，让服务单例管理生命周期
    // 避免在组件卸载时立即释放导致崩溃
    return () => {
      console.log('[WhisperRecorder] 组件卸载，不立即释放资源（由服务管理）');
      // 不在这里释放，避免崩溃
      // 如果需要释放，应该在应用退出时统一释放
    };
  }, [modelPath, onError]);

  // 请求录音权限
  const requestPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限被拒绝', '需要麦克风权限才能录音');
        return false;
      }
      return true;
    } catch {
      Alert.alert('错误', '请求权限失败');
      return false;
    }
  };

  // 开始录音
  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      if (!isInitialized) {
        Alert.alert('错误', 'Whisper 未初始化');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 使用 WAV 格式，whisper.rn 对 WAV 格式支持更好
      // 明确指定格式以确保兼容性
      const { recording: newRecording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 16000, // Whisper 推荐采样率 16kHz
          numberOfChannels: 1, // 单声道
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000, // Whisper 推荐采样率 16kHz
          numberOfChannels: 1, // 单声道
          bitRate: 128000,
          linearPCMBitDepth: 16, // 16位深度
          linearPCMIsBigEndian: false, // 小端序
          linearPCMIsFloat: false, // 不使用浮点数
        },
      });

      console.log('[WhisperRecorder] 录音已创建，开始录音');

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('开始录音失败');
      Alert.alert('错误', err.message);
      onError?.(err);
    }
  };

  // 停止录音并转录
  const stopRecording = async () => {
    if (!recording) return;

    const recordingInstance = recording;
    let audioUri: string | null = null;

    try {
      setIsRecording(false);

      // 先获取 URI，再停止录音
      audioUri = recordingInstance.getURI();
      if (!audioUri) {
        Alert.alert('错误', '录音文件路径不存在');
        setRecording(null);
        return;
      }

      console.log('[WhisperRecorder] 录音文件路径:', audioUri);

      // 获取录音状态信息用于调试
      try {
        const status = await recordingInstance.getStatusAsync();
        console.log('[WhisperRecorder] 录音状态:', {
          durationMillis: status.durationMillis,
          canRecord: status.canRecord,
          isRecording: status.isRecording,
          isDoneRecording: status.isDoneRecording,
        });
      } catch (statusError) {
        console.warn('[WhisperRecorder] 获取录音状态失败:', statusError);
      }

      // 停止录音并卸载
      await recordingInstance.stopAndUnloadAsync();

      console.log('[WhisperRecorder] 录音已停止并卸载，准备转录');
      console.log('[WhisperRecorder] 录音文件 URI:', audioUri);

      // 保存录音文件 URI，用于播放
      setRecordedAudioUri(audioUri);

      // 重置音频模式
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
      } catch (audioModeError) {
        console.warn('[WhisperRecorder] 设置音频模式失败:', audioModeError);
        // 继续执行，不影响转录
      }

      // 开始转录
      setIsTranscribing(true);
      console.log('[WhisperRecorder] 开始转录，文件路径:', audioUri);

      // 确保文件路径格式正确
      // whisper.rn 需要去掉 file:// 前缀或使用完整路径
      const filePathForTranscribe = audioUri;
      if (filePathForTranscribe.startsWith('file://')) {
        // whisper.rn 会自动处理 file:// 前缀，但为了安全，我们保留它
        console.log(
          '[WhisperRecorder] 使用 file:// 路径:',
          filePathForTranscribe
        );
      }

      // 添加超时保护（90秒，给转录更多时间）
      // 使用 base 模型，精度更高
      // 调整参数以提高识别准确率
      const transcriptionTimestamp = Date.now();
      console.log('[WhisperRecorder] ========== 开始转录 ==========');
      console.log('[WhisperRecorder] 转录时间戳:', transcriptionTimestamp);
      console.log('[WhisperRecorder] 文件路径:', filePathForTranscribe);
      console.log('[WhisperRecorder] 使用模型: base (更高精度)');

      const transcribePromise = whisperService
        .transcribe({
          filePath: filePathForTranscribe,
          language: 'zh', // 明确指定中文
          // 不设置 prompt，让模型根据实际音频内容识别，避免固定输出
          wordThold: 0.01, // 降低词阈值，提高识别敏感度
          translate: false, // 不翻译，直接识别中文
          maxContext: -1, // 使用最大上下文窗口，提高识别准确率
          maxLen: 0, // 不限制最大长度，让模型完整识别
        })
        .catch(transcribeError => {
          console.error(
            '[WhisperRecorder] 转录 Promise 错误:',
            transcribeError
          );
          throw transcribeError;
        });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('转录超时（90秒），请重试'));
        }, 90000); // 90秒超时
      });

      const result = await Promise.race([transcribePromise, timeoutPromise]);

      console.log('[WhisperRecorder] ========== 转录完成 ==========');
      console.log('[WhisperRecorder] 转录时间戳:', transcriptionTimestamp);
      console.log('[WhisperRecorder] 文本长度:', result.text?.length || 0);
      console.log('[WhisperRecorder] 转录文本:', result.text);
      console.log('[WhisperRecorder] 片段数量:', result.segments?.length || 0);

      if (result.text) {
        // 检查是否与上次结果相同（用于调试）
        if (transcription && transcription === result.text) {
          console.warn('[WhisperRecorder] ⚠️ 警告：转录结果与上次相同！');
          console.warn('[WhisperRecorder] 上次结果:', transcription);
          console.warn('[WhisperRecorder] 当前结果:', result.text);
        }

        setTranscription(result.text);
        onTranscriptionComplete?.(result);
      } else {
        throw new Error('转录结果为空');
      }
      console.log('[WhisperRecorder] ============================');
    } catch (error) {
      console.error('[WhisperRecorder] 转录错误:', error);
      const err = error instanceof Error ? error : new Error('转录失败');
      const errorMessage = err.message || '转录失败，请重试';
      console.error('[WhisperRecorder] 错误详情:', {
        message: err.message,
        stack: err.stack,
        audioUri,
        errorType: error?.constructor?.name,
        errorString: String(error),
      });

      // 不要立即显示 Alert，避免在崩溃时触发
      // 使用 setTimeout 延迟显示，给应用时间恢复
      setTimeout(() => {
        try {
          Alert.alert('转录失败', errorMessage);
        } catch (alertError) {
          console.error('[WhisperRecorder] 显示 Alert 失败:', alertError);
        }
      }, 100);

      onError?.(err);
    } finally {
      // 确保清理资源
      try {
        if (recordingInstance) {
          // 如果还在录音状态，尝试停止
          try {
            const status = await recordingInstance.getStatusAsync();
            if (status.isRecording) {
              await recordingInstance.stopAndUnloadAsync();
            }
          } catch (e) {
            console.warn('[WhisperRecorder] 清理录音资源时出错:', e);
          }
        }
      } catch (cleanupError) {
        console.warn('[WhisperRecorder] 清理资源失败:', cleanupError);
      }

      setRecording(null);
      setIsTranscribing(false);
    }
  };

  // 播放录音
  const playRecording = async () => {
    if (!recordedAudioUri) {
      Alert.alert('错误', '没有可播放的录音文件');
      return;
    }

    try {
      // 如果正在播放，先停止
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      console.log('[WhisperRecorder] 开始播放录音:', recordedAudioUri);

      // 创建新的播放器实例
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordedAudioUri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      // 监听播放完成事件
      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
            console.log('[WhisperRecorder] 播放完成');
          }
        }
      });
    } catch (error) {
      console.error('[WhisperRecorder] 播放失败:', error);
      Alert.alert('播放失败', '无法播放录音文件');
    }
  };

  // 停止播放
  const stopPlaying = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        console.log('[WhisperRecorder] 停止播放');
      } catch (error) {
        console.error('[WhisperRecorder] 停止播放失败:', error);
      }
    }
  };

  // 清理播放器资源
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, [sound]);

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.statusText}>正在初始化 Whisper...</Text>
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Whisper 初始化失败</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.buttonRecording]}
        onPress={isRecording ? stopRecording : startRecording}
        disabled={isTranscribing}
      >
        <Text style={styles.buttonText}>
          {isRecording ? '停止录音' : '开始录音'}
        </Text>
      </TouchableOpacity>

      {isTranscribing && (
        <View style={styles.transcribingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.transcribingText}>正在转录...</Text>
        </View>
      )}

      {recordedAudioUri && (
        <View style={styles.playbackContainer}>
          <Text style={styles.playbackLabel}>录音文件：</Text>
          <Text style={styles.playbackUri} numberOfLines={1}>
            {recordedAudioUri}
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              styles.playButton,
              isPlaying && styles.playButtonActive,
            ]}
            onPress={isPlaying ? stopPlaying : playRecording}
          >
            <Text style={styles.buttonText}>
              {isPlaying ? '⏸ 停止播放' : '▶ 播放录音'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {transcription ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>转录结果：</Text>
          <Text style={styles.resultText}>{transcription}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 150,
  },
  buttonRecording: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
  },
  transcribingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  transcribingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    width: '100%',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  playbackContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    width: '100%',
  },
  playbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  playbackUri: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  playButton: {
    backgroundColor: '#34C759',
    marginTop: 0,
  },
  playButtonActive: {
    backgroundColor: '#FF3B30',
  },
});
