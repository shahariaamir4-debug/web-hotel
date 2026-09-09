@echo off
title Antix Hotel - Localhost Server Launcher
color 0A
cls
echo ========================================================
echo        🏨 Antix Hotel - 1-Click Localhost Launcher
echo ========================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on your system!
    echo Please download and install Node.js from https://nodejs.org/
    echo Once installed, double click this file again.
    echo.
    pause
    exit /b
)

:: Check and install dependencies
if not exist "node_modules\" (
    echo [1/2] First time setup: Installing project packages...
    echo (This will take about 20-30 seconds, please wait...)
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install encountered an error.
        pause
        exit /b
    )
) else (
    echo [1/2] Packages already installed.
)

echo.
echo [2/2] Starting local server at http://localhost:3000 ...
echo.
echo Opening browser automatically...
echo.

:: Launch browser in background after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"

:: Start Vite dev server
call npm run dev

pause
