@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║           📝 文字提取工具 v1.0                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM 检查是否有拖放的文件夹参数
if "%~1"=="" (
    echo 💡 使用方法:
    echo    1. 直接双击运行 - 提取当前目录
    echo    2. 拖放项目文件夹到此批处理文件 - 提取指定项目
    echo.
    echo 📂 正在提取当前目录...
    echo.
    node "%~dp0extract-text.js"
) else (
    echo 📂 正在提取项目: %~1
    echo.
    node "%~dp0extract-text.js" "%~1"
)

echo.
echo ════════════════════════════════════════════════════════
echo 按任意键退出...
pause >nul