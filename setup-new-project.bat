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

:: Tester si node existe
where node >nul 2>&1
if %errorlevel% neq 0 (
    cls
    echo.
    echo ===================================================
    echo   ERREUR: NODE.JS N'EST PAS INSTALLE
    echo ===================================================
    echo.
    echo Node.js est requis pour lancer ce wizard.
    echo.
    echo ETAPES D'INSTALLATION:
    echo.
    echo   1. Ouvrir https://nodejs.org/ dans votre navigateur
    echo   2. Telecharger la version LTS (Long Term Support^)
    echo   3. Executer l'installateur telecharge
    echo   4. Accepter les options par defaut
    echo   5. IMPORTANT: Redemarrer completement le terminal
    echo   6. Relancer ce wizard
    echo.
    echo ===================================================
    echo.
    pause
    exit /b 1
)

:: Afficher la version de Node.js
for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
if "%NODE_VERSION%"=="" (
    echo ERREUR: Node.js trouve mais version non detectee
    pause
    exit /b 1
)

echo OK - Node.js %NODE_VERSION% detecte
echo.

echo [2/2] Installation des dependances si necessaire...
echo.

:: Installer les dependances si node_modules n'existe pas
if not exist "node_modules\" (
    echo Premiere installation en cours...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ERREUR lors de l'installation des dependances
        pause
        exit /b 1
    )
)

echo.
echo Lancement du serveur...
echo.

:: Lancer le serveur
node setup-server.js

pause
