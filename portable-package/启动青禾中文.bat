@echo off
chcp 65001 >nul
title 青禾中文 - 本地演示服务器
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0qinghe-server.ps1"
if errorlevel 1 (
  echo.
  echo 启动失败，请将整个文件夹解压后再运行，或联系网站作者。
  pause
)
