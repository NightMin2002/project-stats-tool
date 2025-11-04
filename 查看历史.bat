@echo off
chcp 65001 >nul
node src\view-history.js %*
pause