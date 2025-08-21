@echo off

echo Starting backend and frontend servers...

REM Start the backend server in a new window
start "Backend Server" cmd /c "run_backend.bat"

REM Start the frontend server in a new window
start "Frontend Server" cmd /c "run_frontend.bat"

echo Both servers are starting in separate windows.
