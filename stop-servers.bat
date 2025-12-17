@echo off
REM Batch file to stop all Node.js servers
echo Stopping Try-on servers...
echo.

REM Find and kill processes on ports 3000 and 3001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001"') do (
    echo Stopping process on port 3001 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
    echo Stopping process on port 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Done!
pause
