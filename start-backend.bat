@echo off
REM Batch file to start backend server (works without PowerShell execution policy)
echo ========================================
echo Starting Try-on Backend Server
echo ========================================
echo.

cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting backend server...
echo Press Ctrl+C to stop the server
echo.

call npm run dev
