@echo off
echo 🍯 Starting Mehis...

echo 🤖 Starting Ollama...
start "Ollama" ollama serve

timeout /t 3 /nobreak >nul

echo 📱 Starting Telegram bot...
start "Telegram Bot" cmd /k "python adhd_coach_bot.py"

echo 💬 Starting Discord bot...
start "Discord Bot" cmd /k "python discord_bot.py"

echo.
echo ✅ All services started!
echo Telegram: @Mehis
echo Discord: Your server
echo.
pause