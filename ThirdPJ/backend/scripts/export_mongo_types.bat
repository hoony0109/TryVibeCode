@echo off
setlocal EnableExtensions

REM CONFIG
set "PROJECT_ROOT=C:\Work\LaghaimServer\VibeCodeProject\GameManagingTool"
set "MONGODB_URI=mongodb://localhost:27017/UserGameLog_TCP_202502"
set "MONGODB_DB="
set "MONGO_COLLECTION="
set "SAMPLE=1000"
set "MAX_DEPTH=12"
set "OUT=%CD%\types_schema.json"
REM END CONFIG

where node >nul 2>&1
if errorlevel 1 (echo [ERROR] Node.js not found.& exit /b 1)

set "SCRIPT=%PROJECT_ROOT%\backend\scripts\exportTypes.js"
if not exist "%SCRIPT%" set "SCRIPT=%~dp0backend\scripts\exportTypes.js"
if not exist "%SCRIPT%" set "SCRIPT=%~dp0exportTypes.js"
if not exist "%SCRIPT%" (
  echo [ERROR] exportTypes.js not found.
  echo Check: %PROJECT_ROOT%\backend\scripts\exportTypes.js
  echo Or   : %~dp0backend\scripts\exportTypes.js
  echo Or   : %~dp0exportTypes.js
  exit /b 2
)

echo [INFO] SCRIPT=%SCRIPT%
echo [INFO] URI=%MONGODB_URI%
if not "%MONGODB_DB%"=="" echo [INFO] DB=%MONGODB_DB%
if not "%MONGO_COLLECTION%"=="" echo [INFO] COLLECTION=%MONGO_COLLECTION%
echo [INFO] SAMPLE=%SAMPLE%
echo [INFO] MAX_DEPTH=%MAX_DEPTH%
echo [INFO] OUT=%OUT%
echo.

set "MONGODB_URI=%MONGODB_URI%"
set "MONGODB_DB=%MONGODB_DB%"
set "MONGO_COLLECTION=%MONGO_COLLECTION%"
set "SAMPLE=%SAMPLE%"
set "MAX_DEPTH=%MAX_DEPTH%"

node "%SCRIPT%" 1>"%OUT%" 2>&1
if errorlevel 1 (echo [ERROR] failed.& exit /b 1)

echo [OK] done: "%OUT%"
exit /b 0