@echo off
REM Batch file to start both servers (works without PowerShell execution policy)
echo ========================================
echo Starting Try-on Application
echo ========================================
echo.

REM Start backend in new window
echo Starting backend server...
start "Try-on Backend" cmd /k "cd /d %~dp0backend && npm run dev"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo Starting frontend server...
start "Try-on Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

REM Wait a bit
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Application Started!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Two command windows have been opened.
echo Close those windows to stop the servers.
echo.
pause
