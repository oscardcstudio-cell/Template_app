@echo off
chcp 65001 >nul
color 0A
title 🌐 Setup Wizard - Serveur Web

echo.
echo ═══════════════════════════════════════════════════════
echo   🌐 DÉMARRAGE DU WIZARD WEB
echo ═══════════════════════════════════════════════════════
echo.

:: Vérifier que Node.js est installé
echo [1/2] 🔍 Vérification de Node.js...
echo.
node --version >nul 2>&1
if errorlevel 1 (
    echo ═══════════════════════════════════════════════════════
    echo   ❌ NODE.JS N'EST PAS INSTALLÉ
    echo ═══════════════════════════════════════════════════════
    echo.
    echo Node.js est requis pour lancer ce wizard.
    echo.
    echo 📥 ÉTAPES D'INSTALLATION:
    echo.
    echo   1. Aller sur: https://nodejs.org/
    echo   2. Télécharger la version LTS (recommandée)
    echo   3. Lancer l'installateur
    echo   4. Suivre les étapes (garder les options par défaut)
    echo   5. Redémarrer ce terminal ou l'ordinateur
    echo   6. Relancer ce wizard
    echo.
    echo ═══════════════════════════════════════════════════════
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js détecté: 
node --version
echo.

echo [2/2] 📦 Installation des dépendances si nécessaire...
echo.

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
