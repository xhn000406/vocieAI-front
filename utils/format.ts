import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化时间
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 格式化日期
 */
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy年MM月dd日', { locale: zhCN });
};

/**
 * 格式化相对时间
 */
export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: Date): string => {
  return format(date, 'yyyy-MM-dd HH:mm', { locale: zhCN });
};

