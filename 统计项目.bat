@echo off
chcp 65001 >nul
REM v2.5 - Performance Mode: Directly call Node.js script, skipping update check
REM Switch to the script's directory to ensure node src/... path is correct
cd /d "%~dp0"
REM %* passes all command line arguments (including dragged file paths)
node src\project-stats.js %*
pause