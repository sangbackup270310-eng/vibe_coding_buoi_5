@echo off
REM Batch file to start frontend server (works without PowerShell execution policy)
echo ========================================
echo Starting Try-on Frontend Server
echo ========================================
echo.

cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting frontend server...
echo Press Ctrl+C to stop the server
echo.

call npm run dev
