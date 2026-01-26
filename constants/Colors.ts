/**
 * 颜色主题配置
 * 主色：渐变蓝紫（科技+信任）
 * 辅色：暖灰+白色（简洁）
 * 强调色：亮黄或青色（用于按钮、标签）
 */

export const Colors = {
  light: {
    primary: '#6366f1', // 主色：蓝紫色
    primaryGradient: ['#6366f1', '#8b5cf6'], // 渐变蓝紫
    secondary: '#ec4899', // 辅助色
    accent: '#10b981', // 强调色：青色
    accentYellow: '#fbbf24', // 强调色：亮黄
    
    background: '#ffffff',
    surface: '#f9fafb',
    card: '#ffffff',
    
    text: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    
    border: '#e5e7eb',
    divider: '#f3f4f6',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // 录音相关
    recording: '#ef4444',
    recordingBg: '#fef2f2',
    
    // 标签颜色
    tagColors: {
      default: '#e0e7ff',
      text: '#6366f1',
    },
  },
  dark: {
    primary: '#818cf8',
    primaryGradient: ['#818cf8', '#a78bfa'],
    secondary: '#f472b6',
    accent: '#34d399',
    accentYellow: '#fbbf24',
    
    background: '#111827',
    surface: '#1f2937',
    card: '#374151',
    
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    
    border: '#374151',
    divider: '#4b5563',
    
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    recording: '#f87171',
    recordingBg: '#7f1d1d',
    
    tagColors: {
      default: '#4338ca',
      text: '#c7d2fe',
    },
  },
};

export type ColorScheme = 'light' | 'dark';

