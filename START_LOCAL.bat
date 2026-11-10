@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 22.13 or newer, reopen this window, and try again.
  pause
  exit /b 1
)
node -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>22||(major===22&&minor>=13)?0:1)"
if errorlevel 1 (
  echo This project requires Node.js 22.13 or newer. Please update Node.js and try again.
  pause
  exit /b 1
)
if not exist "node_modules\next\package.json" (
  echo Installing website dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo Installation failed. Check your internet connection and the error above.
    pause
    exit /b 1
  )
)
echo.
echo Starting your website. Open http://localhost:3000 in your browser.
echo Keep this window open. Press Ctrl+C to stop the website.
echo.
call npm.cmd run dev
if errorlevel 1 pause
endlocal
