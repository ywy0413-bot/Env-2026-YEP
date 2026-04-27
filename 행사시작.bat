@echo off
chcp 65001 > nul
title 퀴즈 라이브

echo.
echo  =============================================
echo   퀴즈 라이브 서버 시작 중...
echo  =============================================
echo.

:: 퀴즈 서버 실행 (새 창)
start "퀴즈 서버" cmd /k "cd /d "%~dp0" && node server.js"

:: 3초 대기 후 터널 실행
timeout /t 3 /nobreak > nul

:: Cloudflare Tunnel 실행 (새 창) - URL이 이 창에 표시됨
start "Cloudflare 터널 [공개 URL 여기 확인]" cmd /k ""%LOCALAPPDATA%\Microsoft\WinGet\Packages\Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe\cloudflared.exe" tunnel --url http://localhost:3000"

echo.
echo  서버와 터널이 시작되었습니다.
echo.
echo  [Cloudflare 터널] 창에서 공개 URL을 확인하세요.
echo  예: https://xxxx-xxxx.trycloudflare.com
echo.
echo  이 창은 닫아도 됩니다.
pause
