@echo off
REM 手动检查更新脚本
cd /d "%~dp0"
node src/update-checker.js
pause