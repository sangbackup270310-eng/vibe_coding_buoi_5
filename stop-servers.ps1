# PowerShell script to stop all running servers
# Usage: .\stop-servers.ps1

Write-Host "Stopping Try-on servers..." -ForegroundColor Cyan
Write-Host ""

# Function to kill process on a port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($connection in $connections) {
            $processId = $connection.OwningProcess
            try {
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($process) {
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Write-Host "✅ Stopped process on port $Port (PID: $processId)" -ForegroundColor Green
                }
            } catch {
                Write-Host "⚠️  Could not stop process on port $Port" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "ℹ️  No process found on port $Port" -ForegroundColor Gray
    }
}

# Stop processes on ports 3000 and 3001
Write-Host "Checking port 3001 (backend)..." -ForegroundColor Cyan
Stop-ProcessOnPort -Port 3001

Write-Host "Checking port 3000 (frontend)..." -ForegroundColor Cyan
Stop-ProcessOnPort -Port 3000

# Also try to stop any Node processes (optional, be careful)
Write-Host ""
Write-Host "Checking for other Node processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node process(es)" -ForegroundColor Yellow
    $response = Read-Host "Do you want to stop all Node processes? (y/N)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Stopped all Node processes" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  No other Node processes found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green
