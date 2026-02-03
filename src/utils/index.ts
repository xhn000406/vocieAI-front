// 工具函数

/**
 * 格式化日期
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN');
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
