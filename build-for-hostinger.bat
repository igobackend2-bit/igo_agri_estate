@echo off
echo ============================================
echo  IGO Agri Estates - Build for Hostinger
echo ============================================
echo.

echo [1/3] Building project...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo BUILD FAILED. Fix errors above and try again.
    pause
    exit /b 1
)

echo.
echo [2/3] Verifying .htaccess in dist...
if not exist "dist\.htaccess" (
    copy "public\.htaccess" "dist\.htaccess"
    echo   .htaccess copied to dist/
) else (
    echo   .htaccess already present in dist/
)

echo.
echo [3/3] Build complete!
echo.
echo  ====================================================
echo  Upload ALL FILES inside the dist/ folder to
echo  Hostinger public_html (not the dist folder itself)
echo  ====================================================
echo.
echo  IMPORTANT: Make sure .htaccess is uploaded too
echo  (it may be hidden in File Manager - enable "show hidden")
echo.
pause
