@echo off
echo Starting MindCare Application...

echo Starting Backend Server...
start "MindCare Backend" cmd /k "cd backend && npm run dev"

echo Starting Frontend Server...
start "MindCare Frontend" cmd /k "npm run dev"

echo.
echo Application is starting up!
echo Once the servers are ready, open your browser to: http://localhost:5173
echo.
pause
