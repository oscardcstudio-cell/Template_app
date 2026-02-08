@echo off
chcp 65001 >nul
color 0A
title Setup Wizard - Serveur Web

echo.
echo ===================================================
echo   DEMARRAGE DU WIZARD WEB
echo ===================================================
echo.

:: Verifier que Node.js est installe
echo [1/2] Verification de Node.js...
echo.
node --version >nul 2>&1
if errorlevel 1 (
    echo ===================================================
    echo   NODE.JS N'EST PAS INSTALLE
    echo ===================================================
    echo.
    echo Node.js est requis pour lancer ce wizard.
    echo.
    echo ETAPES D'INSTALLATION:
    echo.
    echo   1. Aller sur: https://nodejs.org/
    echo   2. Telecharger la version LTS (recommandee)
    echo   3. Lancer l'installateur
    echo   4. Suivre les etapes (garder les options par defaut)
    echo   5. Redemarrer ce terminal ou l'ordinateur
    echo   6. Relancer ce wizard
    echo.
    echo ===================================================
    echo.
    pause
    exit /b 1
)

echo Node.js detecte: 
node --version
echo.

echo [2/2] Installation des dependances si necessaire...
echo.

:: Installer les dependances si node_modules n'existe pas
if not exist "node_modules\" (
    echo Premiere installation...
    call npm install
)

echo.
echo Lancement du serveur...
echo.

:: Lancer le serveur
node setup-server.js

pause
