@echo off
echo 🎨 My Tutor Flow Logo Setup
echo ========================

echo.
echo Copying your logo file to the project...

REM Check if source file exists
if exist "C:\Users\dalz2\Downloads\My_Tutor_Flow_Logo.png" (
    echo ✅ Found logo file in Downloads folder
    
    REM Create directory if it doesn't exist
    if not exist "public\assets\logos" (
        mkdir "public\assets\logos"
        echo 📁 Created logos directory
    )
    
    REM Copy the file
    copy "C:\Users\dalz2\Downloads\My_Tutor_Flow_Logo.png" "public\assets\logos\My_Tutor_Flow_Logo.png"
    
    if exist "public\assets\logos\My_Tutor_Flow_Logo.png" (
        echo ✅ Logo successfully copied!
        echo.
        echo 🚀 Your logo is now integrated into My Tutor Flow
        echo.
        echo Next steps:
        echo 1. Run: npm run dev
        echo 2. Visit: http://localhost:3000
        echo 3. Check: http://localhost:3000/hackathon-pitch
        echo.
        echo 🎉 Your custom branding is ready!
    ) else (
        echo ❌ Failed to copy logo file
        echo Please check file permissions and try again
    )
) else (
    echo ❌ Logo file not found at: C:\Users\dalz2\Downloads\My_Tutor_Flow_Logo.png
    echo.
    echo Please ensure your logo file is saved as:
    echo "My_Tutor_Flow_Logo.png" in your Downloads folder
    echo.
    echo Or manually copy it to:
    echo "public\assets\logos\My_Tutor_Flow_Logo.png"
)

echo.
pause
