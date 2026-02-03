// Whisper 相关类型定义

export interface WhisperInitOptions {
  filePath: string | number; // 模型文件路径
  isBundleAsset?: boolean; // 是否为 bundle 资源
  useGpu?: boolean; // 是否使用 GPU（iOS）
  useCoreMLIos?: boolean; // iOS 是否使用 CoreML
  useFlashAttn?: boolean; // 是否使用 Flash Attention（需要 GPU）
}

export interface WhisperTranscribeOptions {
  filePath: string; // 音频文件路径
  language?: string; // 语言代码，如 'zh', 'en', 'auto'
  translate?: boolean; // 是否翻译为英文
  maxLen?: number; // 最大段长度（字符数）
  maxContext?: number; // 最大上下文 token 数
  offset?: number; // 时间偏移（毫秒）
  duration?: number; // 持续时间（毫秒）
  tokenTimestamps?: boolean; // 是否包含 token 级别时间戳
  wordThold?: number; // 词时间戳概率阈值
  prompt?: string; // 初始提示词
  onProgress?: (progress: number) => void; // 进度回调（0-100）
  onNewSegments?: (result: { nNew: number; totalNNew: number; result: string; segments: Array<{ text: string; t0: number; t1: number }> }) => void; // 新片段回调
}

export interface WhisperSegment {
  start: number; // 开始时间（秒）
  end: number; // 结束时间（秒）
  text: string; // 文本内容
}

export interface WhisperResult {
  text: string; // 完整文本
  segments?: WhisperSegment[]; // 分段结果
}

export interface WhisperError {
  code: string;
  message: string;
}
