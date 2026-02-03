import { initWhisper, WhisperContext } from 'whisper.rn';
import type {
  TranscribeOptions,
  TranscribeResult,
} from 'whisper.rn';
import type {
  WhisperInitOptions,
  WhisperTranscribeOptions,
  WhisperResult,
  WhisperError,
} from '../types/whisper';

/**
 * Whisper 语音识别服务
 * 封装 whisper.rn 的功能，提供简化的 API
 */
class WhisperService {
  private context: WhisperContext | null = null;
  private isInitialized = false;
  private isReleasing = false; // 防止重复释放

  /**
   * 初始化 Whisper 上下文
   * @param options 初始化选项
   * @returns Promise<void>
   */
  async init(options: WhisperInitOptions): Promise<void> {
    try {
      if (this.isInitialized && this.context) {
        await this.release();
      }

      // 记录初始化参数用于调试
      console.log('[WhisperService] 初始化参数:', {
        filePath: options.filePath,
        isBundleAsset: options.isBundleAsset ?? true,
        useGpu: options.useGpu ?? false,
        useCoreMLIos: options.useCoreMLIos ?? false,
      });

      this.context = await initWhisper({
        filePath: options.filePath,
        isBundleAsset: options.isBundleAsset ?? true, // 默认为 bundle 资源
        useGpu: options.useGpu ?? false,
        useCoreMLIos: options.useCoreMLIos ?? false,
        useFlashAttn: options.useFlashAttn ?? false,
      });

      this.isInitialized = true;
      console.log('[WhisperService] 初始化成功');
    } catch (error) {
      // 输出详细错误信息
      console.error('[WhisperService] 初始化失败:', error);
      if (error instanceof Error) {
        console.error('[WhisperService] 错误堆栈:', error.stack);
      }
      
      const whisperError: WhisperError = {
        code: 'INIT_ERROR',
        message: error instanceof Error 
          ? `初始化失败: ${error.message}` 
          : '初始化失败: 未知错误',
      };
      throw whisperError;
    }
  }

  /**
   * 转录音频文件
   * @param options 转录选项
   * @returns Promise<WhisperResult>
   */
  async transcribe(options: WhisperTranscribeOptions): Promise<WhisperResult> {
    if (!this.context || !this.isInitialized) {
      throw {
        code: 'NOT_INITIALIZED',
        message: 'Whisper 上下文未初始化，请先调用 init() 方法',
      } as WhisperError;
    }

    try {
      // 处理文件路径：确保格式正确
      let filePath = options.filePath;
      
      // 如果路径以 file:// 开头，确保格式正确
      if (filePath.startsWith('file://')) {
        // whisper.rn 会自动处理 file:// 前缀，但我们需要确保路径正确
        console.log('[WhisperService] 转录文件路径:', filePath);
      }

      // 构建转录选项，只包含有值的参数
      // 注意：maxLen 和 maxContext 可能为 0 或 -1，这些是有效值，不应该被过滤
      const transcribeOptions: TranscribeOptions = {
        language: options.language,
        translate: options.translate ?? false,
        tokenTimestamps: options.tokenTimestamps ?? false,
        // 只在值不为 undefined 时才设置
        ...(options.maxLen !== undefined && { maxLen: options.maxLen }),
        ...(options.maxContext !== undefined && { maxContext: options.maxContext }),
        ...(options.offset !== undefined && { offset: options.offset }),
        ...(options.duration !== undefined && { duration: options.duration }),
        ...(options.wordThold !== undefined && { wordThold: options.wordThold }),
        // 只在 prompt 存在时才设置，避免传递 undefined
        ...(options.prompt && { prompt: options.prompt }),
      };

      console.log('[WhisperService] 开始转录，选项:', {
        filePath,
        language: transcribeOptions.language,
        translate: transcribeOptions.translate,
        wordThold: transcribeOptions.wordThold,
        maxLen: transcribeOptions.maxLen,
        maxContext: transcribeOptions.maxContext,
        hasPrompt: !!transcribeOptions.prompt,
        allOptions: JSON.stringify(transcribeOptions),
      });

      // 使用 try-catch 包装原生调用，防止崩溃
      let promise: Promise<TranscribeResult>;
      try {
        const transcribeResult = this.context.transcribe(
          filePath,
          transcribeOptions
        );
        promise = transcribeResult.promise;
      } catch (nativeError) {
        console.error('[WhisperService] 调用原生 transcribe 失败:', nativeError);
        throw new Error(`调用转录接口失败: ${nativeError instanceof Error ? nativeError.message : String(nativeError)}`);
      }

      const result: TranscribeResult = await promise;

      console.log('[WhisperService] 转录完成，结果长度:', result.result?.length || 0);

      return {
        text: result.result || '',
        segments: result.segments?.map((seg) => ({
          start: seg.t0 / 1000, // 转换为秒
          end: seg.t1 / 1000, // 转换为秒
          text: seg.text,
        })),
      };
    } catch (error) {
      console.error('[WhisperService] 转录失败:', error);
      if (error instanceof Error) {
        console.error('[WhisperService] 错误堆栈:', error.stack);
      }
      
      const whisperError: WhisperError = {
        code: 'TRANSCRIBE_ERROR',
        message: error instanceof Error 
          ? `转录失败: ${error.message}` 
          : '转录失败: 未知错误',
      };
      throw whisperError;
    }
  }

  /**
   * 释放 Whisper 上下文
   */
  async release(): Promise<void> {
    // 如果正在释放或已经释放，直接返回
    if (this.isReleasing) {
      console.log('[WhisperService] 正在释放中，跳过重复释放');
      return;
    }

    if (!this.context || !this.isInitialized) {
      console.log('[WhisperService] 上下文已释放或不存在，跳过');
      return;
    }

    this.isReleasing = true;
    const contextToRelease = this.context;
    
    try {
      console.log('[WhisperService] 开始释放上下文');
      
      // 先清除引用，避免其他地方使用
      this.context = null;
      this.isInitialized = false;
      
      // 然后释放原生资源
      await contextToRelease.release();
      console.log('[WhisperService] 上下文释放成功');
    } catch (error) {
      console.error('[WhisperService] 释放 Whisper 上下文失败:', error);
      // 即使释放失败，也确保状态已清除
    } finally {
      // 确保状态已清除
      this.context = null;
      this.isInitialized = false;
      this.isReleasing = false;
      console.log('[WhisperService] 释放流程完成');
    }
  }

  /**
   * 检查是否已初始化
   */
  get initialized(): boolean {
    return this.isInitialized;
  }

  /**
   * 获取当前上下文
   */
  get currentContext(): WhisperContext | null {
    return this.context;
  }
}

// 导出单例实例
export const whisperService = new WhisperService();

