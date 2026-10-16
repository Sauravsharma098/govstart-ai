@echo off
title GovStart AI Platform Launcher
color 0B
echo ========================================================
echo        GovStart AI - Startup Procurement Platform       
echo ========================================================
echo.

:: 1. Start Python FastAPI AI Microservice (Port 8000)
echo [1/3] Starting Python AI Microservice on port 8000...
start "GovStart AI - Python Engine (Port 8000)" cmd /k "cd /d %~dp0ai-service && python main.py"

:: 2. Start Java Spring Boot Backend & Web App (Port 8080)
echo [2/3] Starting Spring Boot REST Backend on port 8080...
start "GovStart AI - Spring Boot (Port 8080)" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

:: 3. Wait for boot and open browser
echo [3/3] Waiting for servers to initialize...
timeout /t 6 /nobreak >nul

echo Opening browser at http://localhost:8080/ ...
start "" "http://localhost:8080/"

echo.
echo ========================================================
echo   Platform is running!
echo   Web Application: http://localhost:8080/
echo   AI Microservice: http://localhost:8000/
echo ========================================================
echo.
pause
