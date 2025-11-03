@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║           📊 项目统计工具 v2.0                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM 检查是否有拖放的文件夹参数
if "%~1"=="" (
    echo 💡 使用方法:
    echo    1. 直接双击运行 - 统计当前目录
    echo    2. 拖放项目文件夹到此批处理文件 - 统计指定项目
    echo.
    echo 📂 正在统计当前目录...
    echo.
    node "%~dp0project-stats.js"
) else (
    echo 📂 正在统计项目: %~1
    echo.
    node "%~dp0project-stats.js" "%~1"
)

echo.
echo ════════════════════════════════════════════════════════
echo 按任意键退出...
pause >nul