@echo off
chcp 65001 >nul
REM View history report CLI tool
cd /d "%~dp0"
node src\view-history.js %*
pause