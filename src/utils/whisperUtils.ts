/**
 * Whisper 工具函数
 * 提供模型路径处理、文件格式转换等实用功能
 */

import { Platform } from 'react-native';

/**
 * 获取模型文件的正确路径
 * @param modelName 模型文件名或 require 资源
 * @returns 模型文件路径
 */
export function getModelPath(modelName: string | number): string | number {
  // 如果是 bundle 资源路径（require），直接返回
  if (typeof modelName === 'number') {
    return modelName;
  }

  // 如果已经是完整路径，直接返回
  if (modelName.startsWith('/') || modelName.startsWith('file://')) {
    return modelName;
  }

  // 返回原始路径（实际使用时需要确保路径正确）
  return modelName;
}

/**
 * 检查模型文件路径格式是否正确
 * @param filePath 文件路径
 * @returns boolean
 */
export function isValidModelPath(filePath: string | number): boolean {
  if (typeof filePath === 'number') {
    return true; // require 资源路径
  }

  return (
    filePath.length > 0 &&
    (filePath.endsWith('.bin') ||
      filePath.startsWith('/') ||
      filePath.startsWith('file://'))
  );
}

/**
 * 获取推荐的模型配置
 * @param deviceType 设备类型：'low' | 'medium' | 'high'
 * @returns 推荐的模型名称和配置
 */
export function getRecommendedModel(deviceType: 'low' | 'medium' | 'high' = 'medium') {
  const models = {
    low: {
      name: 'ggml-tiny.bin',
      size: '~75 MB',
      description: '最快速度，适合低端设备',
      useGpu: false,
      useCoreMLIos: false,
    },
    medium: {
      name: 'ggml-base.bin',
      size: '~140 MB',
      description: '平衡速度和精度，推荐使用',
      useGpu: false,
      useCoreMLIos: true,
    },
    high: {
      name: 'ggml-small.bin',
      size: '~460 MB',
      description: '较高精度，适合高端设备',
      useGpu: true,
      useCoreMLIos: true,
    },
  };

  return models[deviceType];
}

/**
 * 格式化音频文件路径
 * @param uri 音频文件 URI
 * @returns 格式化后的路径
 */
export function formatAudioPath(uri: string | null | undefined): string {
  if (!uri) {
    throw new Error('音频文件路径为空');
  }

  // 如果已经是文件路径格式，直接返回
  if (uri.startsWith('file://')) {
    return uri;
  }

  // 如果是 content:// URI (Android)，直接返回
  if (uri.startsWith('content://')) {
    return uri;
  }

  // 添加 file:// 前缀
  if (!uri.startsWith('/')) {
    return `file://${uri}`;
  }

  return `file://${uri}`;
}

/**
 * 获取模型下载 URL
 * @param modelName 模型名称
 * @returns 下载 URL
 */
export function getModelDownloadUrl(modelName: string): string {
  const baseUrl = 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main';
  return `${baseUrl}/${modelName}`;
}

/**
 * 支持的模型列表
 */
export const SUPPORTED_MODELS = [
  {
    name: 'ggml-tiny.bin',
    size: '~75 MB',
    description: '最快速度，精度较低',
    downloadUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin',
  },
  {
    name: 'ggml-base.bin',
    size: '~140 MB',
    description: '平衡速度和精度',
    downloadUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin',
  },
  {
    name: 'ggml-small.bin',
    size: '~460 MB',
    description: '较高精度',
    downloadUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin',
  },
  {
    name: 'ggml-medium.bin',
    size: '~1.4 GB',
    description: '高精度',
    downloadUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin',
  },
  {
    name: 'ggml-large.bin',
    size: '~2.9 GB',
    description: '最高精度',
    downloadUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large.bin',
  },
] as const;

