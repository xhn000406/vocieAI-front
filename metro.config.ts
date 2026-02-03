const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 将 'bin' 添加到资源扩展名列表中，以便识别模型文件
config.resolver.assetExts.push('bin');

// 如果你要用 CoreML (iOS专用加速)，还要加上 'mil'
config.resolver.assetExts.push('mil');

module.exports = config;