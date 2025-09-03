Write-Host "Starting Frassati Slides on localhost..." -ForegroundColor Green
Write-Host ""
Write-Host "Your site will be available at:" -ForegroundColor Yellow
Write-Host "  Main page: http://localhost:8000/" -ForegroundColor Cyan
Write-Host "  September 2nd slides: http://localhost:8000/September%202nd/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Try Python first
try {
    python -m http.server 8000
} catch {
    # Try Python3
    try {
        python3 -m http.server 8000
    } catch {
        # Try Node.js http-server
        try {
            npx http-server -p 8000
        } catch {
            Write-Host ""
            Write-Host "❌ No HTTP server found!" -ForegroundColor Red
            Write-Host ""
            Write-Host "Please install one of these:" -ForegroundColor Yellow
            Write-Host "  - Python: https://python.org" -ForegroundColor Cyan
            Write-Host "  - Node.js: https://nodejs.org" -ForegroundColor Cyan
            Write-Host "  - Or use VS Code Live Server extension" -ForegroundColor Cyan
            Write-Host ""
            Read-Host "Press Enter to continue"
        }
    }
}

