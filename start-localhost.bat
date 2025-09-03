@echo off
echo Starting Frassati Slides on localhost...
echo.
echo Your site will be available at:
echo   Main page: http://localhost:8000/
echo   September 2nd slides: http://localhost:8000/September%202nd/
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try Python first
python -m http.server 8000 2>nul
if %errorlevel% neq 0 (
    REM Try Python3 if python doesn't work
    python3 -m http.server 8000 2>nul
    if %errorlevel% neq 0 (
        REM Try Node.js http-server
        npx http-server -p 8000 2>nul
        if %errorlevel% neq 0 (
            echo.
            echo ❌ No HTTP server found!
            echo.
            echo Please install one of these:
            echo   - Python: https://python.org
            echo   - Node.js: https://nodejs.org
            echo   - Or use VS Code Live Server extension
            echo.
            pause
        )
    )
)

