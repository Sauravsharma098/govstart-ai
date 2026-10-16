@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script for GovStart AI
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set MVN_EXEC=mvn.cmd
where %MVN_EXEC% >nul 2>&1
if %ERRORLEVEL% equ 0 (
    %MVN_EXEC% %*
    exit /b %ERRORLEVEL%
)

set LOCAL_MVN=C:\Users\raysa\Downloads\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd
if exist "%LOCAL_MVN%" (
    "%LOCAL_MVN%" %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found in PATH or at %LOCAL_MVN%
exit /b 1
