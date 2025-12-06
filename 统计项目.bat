@echo off
REM v2.5 - 性能模式：直接调用 Node.js 脚本，跳过更新检查
REM 切换到脚本所在目录，确保 node src/... 路径正确
cd /d "%~dp0"
REM %* 将传递所有命令行参数（包括拖拽的文件路径）
node src/project-stats.js %*
pause