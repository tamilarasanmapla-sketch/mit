@echo off
cd /d "C:\Users\tamil\OneDrive\Desktop\new\class\ecom"
echo Checking git status...
git status
echo.
echo Adding all changes...
git add .
echo.
echo Committing changes...
git commit -m "Code update"
echo.
echo Pushing to tam branch...
git push origin tam
echo.
echo Done!
pause
