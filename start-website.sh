#!/bin/bash
echo "========================================================"
echo "       🏨 Antix Hotel - 1-Click Localhost Launcher"
echo "========================================================"
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed! Please install Node.js from https://nodejs.org/"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "[1/2] First time setup: Installing dependencies..."
    npm install
fi

echo "[2/2] Starting local development server at http://localhost:3000 ..."
sleep 2 && (open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null) &
npm run dev
