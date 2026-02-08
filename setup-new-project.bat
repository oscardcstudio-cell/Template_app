@echo off
chcp 65001 >nul
color 0A
title 🌐 Setup Wizard - Serveur Web

echo.
echo ═══════════════════════════════════════════════════════
echo   🌐 DÉMARRAGE DU WIZARD WEB
echo ═══════════════════════════════════════════════════════
echo.
echo Installation des dépendances si nécessaire...

:: Installer les dépendances si node_modules n'existe pas
if not exist "node_modules\" (
    echo 📦 Première installation...
    call npm install
)

echo.
echo 🚀 Lancement du serveur...
echo.

:: Lancer le serveur
node setup-server.js

pause
