/**
 * Whisper 模型配置
 * 用于管理和切换不同的 Whisper 模型
 */

import { Platform } from 'react-native';
import { getRecommendedModel, SUPPORTED_MODELS } from '../utils/whisperUtils';

/**
 * 模型类型
 */
export type ModelType = 'tiny' | 'base' | 'small' | 'medium' | 'large';

/**
 * 模型配置接口
 */
export interface ModelConfig {
  name: string;
  fileName: string;
  size: string;
  description: string;
  useGpu?: boolean;
  useCoreMLIos?: boolean;
  downloadUrl: string;
}

/**
 * 可用的模型配置
 */
export const WHISPER_MODELS: Record<ModelType, ModelConfig> = {
  tiny: {
    name: 'Tiny',
    fileName: 'ggml-tiny.bin',
    size: '~75 MB',
    description: '最快速度，精度较低，适合低端设备',
    useGpu: false,
    useCoreMLIos: false,
    downloadUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin',
  },
  base: {
    name: 'Base',
    fileName: 'ggml-base.bin',
    size: '~140 MB',
    description: '平衡速度和精度，推荐使用',
    useGpu: false,
    useCoreMLIos: true,
    downloadUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin',
  },
  small: {
    name: 'Small',
    fileName: 'ggml-small.bin',
    size: '~460 MB',
    description: '较高精度，适合高端设备',
    useGpu: true,
    useCoreMLIos: true,
    downloadUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin',
  },
  medium: {
    name: 'Medium',
    fileName: 'ggml-medium.bin',
    size: '~1.4 GB',
    description: '高精度，需要较大内存',
    useGpu: true,
    useCoreMLIos: true,
    downloadUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin',
  },
  large: {
    name: 'Large',
    fileName: 'ggml-large.bin',
    size: '~2.9 GB',
    description: '最高精度，需要大量内存',
    useGpu: true,
    useCoreMLIos: true,
    downloadUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large.bin',
  },
};

/**
 * 当前使用的模型类型
 * 修改这里即可切换模型
 */
export const CURRENT_MODEL: ModelType = 'tiny'; // 可以改为 'base', 'small', 'medium', 'large'

/**
 * 获取当前模型配置
 */
export function getCurrentModelConfig(): ModelConfig {
  return WHISPER_MODELS[CURRENT_MODEL];
}

/**
 * 获取当前模型的文件路径
 * @param modelType 模型类型，如果不提供则使用 CURRENT_MODEL
 */
export function getModelPath(modelType?: ModelType): string {
  console.log(modelType)
  const model = modelType ? WHISPER_MODELS[modelType] : getCurrentModelConfig();
  return model.fileName;
}

/**
 * 获取模型初始化选项
 * @param modelType 模型类型，如果不提供则使用 CURRENT_MODEL
 */
export function getModelInitOptions(modelType?: ModelType) {
  
  const model = modelType ? WHISPER_MODELS[modelType] : getCurrentModelConfig();
  return {
    filePath: model.fileName,
    isBundleAsset: true,
    useGpu: model.useGpu ?? false,
    useCoreMLIos: model.useCoreMLIos ?? false,
  };
}

