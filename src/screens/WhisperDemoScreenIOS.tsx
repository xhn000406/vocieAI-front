import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Audio } from 'expo-av';
import { initWhisper } from 'whisper.rn';
import { Asset } from 'expo-asset';

export default function WhisperDemoScreenIOS() {
  const [whisperContext, setWhisperContext] = useState<any>(null);
  const [result, setResult] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // 1. 初始化 Whisper 上下文 (加载模型)
  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelAsset = Asset.fromModule(
          require('../../assets/models/ggml-tiny.bin')
        );
        await modelAsset.downloadAsync();

        const context = await initWhisper({
          filePath: modelAsset.localUri,
        });
        
        setWhisperContext(context);
        console.log('Whisper initialized!');
      } catch (e) {
        console.error('模型加载失败:', e);
      }
    };

    loadModel();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return;
      }

      if (!whisperContext) {
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      setRecording(newRecording);
      setIsRecording(true);
    } catch (e) {
      console.error('开始录音失败:', e);
    }
  };

  const stopRecordingAndTranscribe = async () => {
    if (!whisperContext) return;
    if (!recording) return;

    try {
      setIsRecording(false);
      setIsTranscribing(true);

      const recordingInstance = recording;
      const uri = recordingInstance.getURI();
      if (!uri) {
        console.error('录音文件不存在');
        setIsTranscribing(false);
        return;
      }

      await recordingInstance.stopAndUnloadAsync();

      const { promise } = whisperContext.transcribe(uri, {
        language: 'zh', // 设置语言
      });

      const { result: text } = await promise;
      setResult(text);
    } catch (e) {
      console.error('转写失败:', e);
    } finally {
      setIsTranscribing(false);
      setRecording(null);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Whisper iOS 录音转写 Demo</Text>
      <Text>{whisperContext ? '模型已加载' : '加载模型中...'}</Text>
      <Button
        title={
          isRecording
            ? isTranscribing
              ? '转写中...'
              : '停止并转写'
            : '开始录音'
        }
        disabled={!whisperContext || isTranscribing}
        onPress={
          isRecording ? stopRecordingAndTranscribe : startRecording
        }
      />
      <Text>结果: {result}</Text>
    </View>
  );
}
