@echo off
cd /d "%~dp0"
cd frontend
echo Current_Directory: %cd%
:: 현재 경로에서 실행
npm run dev
