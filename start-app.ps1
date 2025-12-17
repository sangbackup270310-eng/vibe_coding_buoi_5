# PowerShell script to start both backend and frontend servers
# Usage: .\start-app.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Try-on Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to kill process on a port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connection) {
        $processId = $connection.OwningProcess
        try {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Freed port $Port" -ForegroundColor Green
            Start-Sleep -Seconds 1
        } catch {
            Write-Host "⚠️  Could not free port $Port" -ForegroundColor Yellow
        }
    }
}

# Free ports if in use
Write-Host "Checking ports..." -ForegroundColor Cyan
Stop-ProcessOnPort -Port 3001
Stop-ProcessOnPort -Port 3000
Write-Host ""

# Get script directory
$scriptDir = $PSScriptRoot

# Start backend in new window
Write-Host "Starting backend server..." -ForegroundColor Cyan
$backendScript = Join-Path $scriptDir "start-backend.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-File", "`"$backendScript`"" -WindowStyle Minimized

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in new window
Write-Host "Starting frontend server..." -ForegroundColor Cyan
$frontendScript = Join-Path $scriptDir "start-frontend.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-File", "`"$frontendScript`"" -WindowStyle Minimized

# Wait a bit
Start-Sleep -Seconds 5

# Check if servers are running
Write-Host ""
Write-Host "Checking server status..." -ForegroundColor Cyan

try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Backend is running on http://localhost:3001" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend is starting... (may take a few more seconds)" -ForegroundColor Yellow
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Frontend is running on http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Frontend is starting... (may take a few more seconds)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two PowerShell windows have been opened:" -ForegroundColor Gray
Write-Host "  - One for backend server" -ForegroundColor Gray
Write-Host "  - One for frontend server" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop the servers, close those windows or press Ctrl+C in each." -ForegroundColor Gray
Write-Host ""
