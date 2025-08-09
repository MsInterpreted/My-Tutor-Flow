@echo off
echo ========================================
echo   MY TUTOR FLOW - GITHUB PREPARATION
echo ========================================
echo.

echo Creating GitHub-ready folder...
mkdir "my-tutor-flow-github" 2>nul

echo Copying essential files...
xcopy "src" "my-tutor-flow-github\src" /E /I /Y
xcopy "public" "my-tutor-flow-github\public" /E /I /Y
copy "package.json" "my-tutor-flow-github\" /Y
copy "package-lock.json" "my-tutor-flow-github\" /Y 2>nul
copy "vite.config.js" "my-tutor-flow-github\" /Y 2>nul
copy "index.html" "my-tutor-flow-github\" /Y 2>nul
copy "README.md" "my-tutor-flow-github\" /Y
copy "LICENSE" "my-tutor-flow-github\" /Y
copy "CONTRIBUTING.md" "my-tutor-flow-github\" /Y
copy ".gitignore" "my-tutor-flow-github\" /Y 2>nul
copy ".env.example" "my-tutor-flow-github\" /Y 2>nul

echo.
echo ========================================
echo   PREPARATION COMPLETE!
echo ========================================
echo.
echo Your GitHub-ready files are in: my-tutor-flow-github\
echo.
echo NEXT STEPS:
echo 1. Go to github.com and create a new repository called 'my-tutor-flow'
echo 2. Upload all files from the 'my-tutor-flow-github' folder
echo 3. Or use GitHub Desktop to sync the folder
echo.
echo Press any key to open the folder...
pause >nul
explorer "my-tutor-flow-github"
