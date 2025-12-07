@echo off
chcp 65001 >nul
REM Manual update check script
cd /d "%~dp0"
node src\update-checker.js
pause