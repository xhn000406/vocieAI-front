import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { WhisperRecorder } from '../components/WhisperRecorder';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { getCurrentModelConfig, getModelPath, CURRENT_MODEL } from '../config/whisperModel';
import type { WhisperResult } from '../types/whisper';

/**
 * Whisper 演示页面
 * 展示如何使用 Whisper 进行语音识别
 */
export const WhisperDemoScreen: React.FC = () => {
  const [transcriptionHistory, setTranscriptionHistory] = useState<WhisperResult[]>([]);

  const handleTranscriptionComplete = (result: WhisperResult) => {
    setTranscriptionHistory((prev) => [result, ...prev]);
    Alert.alert('转录完成', `识别结果：${result.text}`);
  };

  const handleError = (error: Error) => {
    console.error('Whisper 错误:', error);
    Alert.alert('错误', error.message);
  };

  // 获取当前模型配置
  // 要切换模型，请修改 src/config/whisperModel.ts 中的 CURRENT_MODEL
  const currentModelConfig = getCurrentModelConfig();
  const modelPath = getModelPath();
  
  console.log('[WhisperDemoScreen] 当前模型:', CURRENT_MODEL, '文件:', modelPath, '平台:', Platform.OS);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Whisper 语音识别演示</Text>
        <Text style={styles.subtitle}>
          点击按钮开始录音，停止后会自动进行语音转文字
        </Text>
        <View style={styles.modelInfo}>
          <Text style={styles.modelInfoText}>
            当前模型: {currentModelConfig.name} ({currentModelConfig.size})
          </Text>
          <Text style={styles.modelInfoDesc}>{currentModelConfig.description}</Text>
        </View>
      </View>

      <View style={styles.recorderContainer}>
        <ErrorBoundary>
          <WhisperRecorder
            modelPath={modelPath}
            onTranscriptionComplete={handleTranscriptionComplete}
            onError={handleError}
          />
        </ErrorBoundary>
      </View>

      {transcriptionHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>转录历史：</Text>
          {transcriptionHistory.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyText}>{item.text}</Text>
              {item.segments && item.segments.length > 0 && (
                <View style={styles.segmentsContainer}>
                  {item.segments.map((seg, segIndex) => (
                    <View key={segIndex} style={styles.segmentItem}>
                      <Text style={styles.segmentTime}>
                        [{seg.start.toFixed(2)}s - {seg.end.toFixed(2)}s]
                      </Text>
                      <Text style={styles.segmentText}>{seg.text}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>使用说明：</Text>
        <Text style={styles.infoText}>
          1. 首次使用需要授予麦克风权限{'\n'}
          2. 点击"开始录音"按钮开始录音{'\n'}
          3. 点击"停止录音"按钮停止录音并开始转录{'\n'}
          4. 转录结果会显示在下方
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>切换模型：</Text>
        <Text style={styles.infoText}>
          1. 下载新模型文件到 assets 目录{'\n'}
          2. 修改 src/config/whisperModel.ts 中的 CURRENT_MODEL{'\n'}
          3. 将新模型文件复制到 android/app/src/main/assets/{'\n'}
          4. 重新构建应用
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  modelInfo: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    width: '100%',
  },
  modelInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  modelInfoDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  recorderContainer: {
    padding: 20,
  },
  historyContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  historyItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  historyText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  segmentsContainer: {
    marginTop: 10,
  },
  segmentItem: {
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  segmentTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  segmentText: {
    fontSize: 14,
    color: '#333',
  },
  infoContainer: {
    padding: 20,
    marginTop: 20,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    margin: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

