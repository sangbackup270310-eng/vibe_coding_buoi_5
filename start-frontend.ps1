# PowerShell script to start the frontend server
# Usage: .\start-frontend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Try-on Frontend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if port 3000 is in use
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Port 3000 is already in use" -ForegroundColor Yellow
    Write-Host "Attempting to free the port..." -ForegroundColor Yellow
    
    $processId = $portInUse.OwningProcess
    try {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "✅ Port 3000 freed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Could not free port 3000. Please close the application using it manually." -ForegroundColor Red
        exit 1
    }
}

# Navigate to frontend directory
$frontendPath = Join-Path $PSScriptRoot "frontend"
if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Frontend directory not found at: $frontendPath" -ForegroundColor Red
    exit 1
}

Set-Location $frontendPath

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    
    $envContent = "VITE_API_BASE_URL=http://localhost:3001"
    $envContent | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ Created .env file" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the server
npm run dev
