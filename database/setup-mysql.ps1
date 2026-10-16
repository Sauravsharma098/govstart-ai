# GovStart AI - MySQL Database Setup Script
# Usage: .\database\setup-mysql.ps1 -Password "YourMySQLPassword"

param(
    [string]$Password = "root",
    [string]$User = "root",
    [string]$Host = "localhost",
    [string]$Port = "3306"
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " GovStart AI - Database Initialization   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (-not (Test-Path $mysqlPath)) {
    $mysqlPath = (Get-Command mysql.exe -ErrorAction SilentlyContinue).Source
}

if (-not $mysqlPath) {
    Write-Error "mysql.exe could not be found. Please ensure MySQL 8.x is installed."
    exit 1
}

Write-Host "Using MySQL client at: $mysqlPath" -ForegroundColor Green
Write-Host "Connecting to $Host:$Port as $User..." -ForegroundColor Yellow

# 1. Run Schema
Write-Host "`n[1/2] Applying Database Schema (DDL)..." -ForegroundColor Yellow
$schemaFile = Join-Path $PSScriptRoot "schema.sql"
Get-Content $schemaFile | & $mysqlPath -h $Host -P $Port -u $User "--password=$Password"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to execute schema.sql! Please check your password or connection."
    exit 1
}
Write-Host "Schema created successfully!" -ForegroundColor Green

# 2. Run Seed Data
Write-Host "`n[2/2] Seeding Fictional Tenders, Startups & Demo Data..." -ForegroundColor Yellow
$seedFile = Join-Path $PSScriptRoot "seed-data.sql"
Get-Content $seedFile | & $mysqlPath -h $Host -P $Port -u $User "--password=$Password"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to execute seed-data.sql!"
    exit 1
}
Write-Host "Seed data inserted successfully!" -ForegroundColor Green

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host " Database setup complete for GovStart AI! " -ForegroundColor Cyan
Write-Host " Database Name: govstart_ai              " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
