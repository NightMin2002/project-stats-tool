@echo off
chcp 65001 >nul
cd /d "%~dp0"
node src\view-history.js %*
pause