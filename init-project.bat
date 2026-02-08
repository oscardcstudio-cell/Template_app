@echo off
chcp 65001 >nul
color 0E
title 🎯 Configuration du Projet

echo.
echo ═══════════════════════════════════════════════════════
echo   🎯 CONFIGURATION DU PROJET
echo ═══════════════════════════════════════════════════════
echo.
echo Ce wizard va te poser des questions pour configurer
echo ton projet selon tes besoins.
echo.
echo Appuie sur une touche pour continuer...
pause >nul

:: Vérifier que node_modules existe
if not exist "node_modules\" (
    echo.
    echo 📦 Installation des dépendances...
    call npm install
    echo.
)

:: Lancer le wizard
node init-project.js

echo.
pause
