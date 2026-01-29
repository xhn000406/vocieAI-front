# Android SDK 环境变量设置脚本
# 运行此脚本需要管理员权限

$androidSdkPath = "C:\Users\xiaosipan\AppData\Local\Android\Sdk"

# 检查 Android SDK 是否存在
if (Test-Path $androidSdkPath) {
    Write-Host "找到 Android SDK: $androidSdkPath" -ForegroundColor Green
    
    # 设置用户级环境变量
    [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $androidSdkPath, 'User')
    [System.Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', $androidSdkPath, 'User')
    
    # 添加到 PATH（如果不存在）
    $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
    $platformTools = "$androidSdkPath\platform-tools"
    $tools = "$androidSdkPath\tools"
    $emulator = "$androidSdkPath\emulator"
    
    $pathsToAdd = @($platformTools, $tools, $emulator)
    $updatedPath = $currentPath
    
    foreach ($path in $pathsToAdd) {
        if ($updatedPath -notlike "*$path*") {
            $updatedPath += ";$path"
            Write-Host "添加路径到 PATH: $path" -ForegroundColor Yellow
        }
    }
    
    [System.Environment]::SetEnvironmentVariable('Path', $updatedPath, 'User')
    
    Write-Host "`n环境变量已设置！" -ForegroundColor Green
    Write-Host "请重新打开终端窗口以使更改生效。" -ForegroundColor Yellow
    Write-Host "`n设置的环境变量：" -ForegroundColor Cyan
    Write-Host "  ANDROID_HOME = $androidSdkPath"
    Write-Host "  ANDROID_SDK_ROOT = $androidSdkPath"
} else {
    Write-Host "未找到 Android SDK，请先安装 Android Studio" -ForegroundColor Red
    Write-Host "下载地址: https://developer.android.com/studio" -ForegroundColor Yellow
}
