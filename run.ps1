# GovStart AI - PowerShell Quick Launcher

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      GovStart AI - Startup Procurement Platform        " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$root = $PSScriptRoot

# 1. Start Python AI Microservice
Write-Host "[1/3] Starting Python FastAPI Microservice (Port 8000)..." -ForegroundColor Yellow
Start-Process wt -ArgumentList "-w 0 nt -d `"$root\ai-service`" cmd /k python main.py" -ErrorAction SilentlyContinue
if (-not $?) {
    Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$root\ai-service'; python main.py`""
}

# 2. Start Spring Boot Backend
Write-Host "[2/3] Starting Java Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process wt -ArgumentList "-w 0 nt -d `"$root\backend`" cmd /k mvnw.cmd spring-boot:run" -ErrorAction SilentlyContinue
if (-not $?) {
    Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$root\backend'; .\mvnw.cmd spring-boot:run`""
}

# 3. Wait and open browser
Write-Host "[3/3] Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 6

Write-Host "Launching web browser at http://localhost:8080/ ..." -ForegroundColor Green
Start-Process "http://localhost:8080/"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  GovStart AI is live!                                  " -ForegroundColor Green
Write-Host "  Frontend & API : http://localhost:8080/               " -ForegroundColor Green
Write-Host "  AI Microservice: http://localhost:8000/               " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
