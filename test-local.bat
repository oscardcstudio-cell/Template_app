@echo off
chcp 65001 >nul
color 0B
title 🧪 Test Local - Application

echo.
echo ═══════════════════════════════════════════════════════
echo   🧪 TEST LOCAL DE L'APPLICATION
echo ═══════════════════════════════════════════════════════
echo.

:: ========================================
:: Vérifications préalables
:: ========================================

echo [1/5] 🔍 Vérification de l'environnement...
echo.

:: Vérifier que src/index.js existe
if not exist "src\index.js" (
    echo ❌ Le fichier src\index.js est manquant !
    echo.
    echo ⚠️  As-tu lancé le wizard de configuration ?
    echo.
    echo 👉 Double-clic sur init-project.bat pour configurer ton projet
    echo.
    pause
    exit /b 1
)

:: Vérifier que Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé !
    echo.
    echo Téléchargez Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js détecté: 
node --version
echo.

:: Vérifier que node_modules existe
if not exist "node_modules\" (
    echo ⚠️  node_modules n'existe pas
    echo 📦 Installation des dépendances...
    echo.
    call npm install
    echo.
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation des dépendances
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées
    echo.
) else (
    echo [2/5] 📦 Vérification des dépendances...
echo.

:: Vérifier que node_modules existe
if not exist ".env" (
    echo ⚠️  Fichier .env manquant
    echo.
    if exist ".env.example" (
        echo 📝 Copie de .env.example vers .env...
        copy .env.example .env >nul
        echo.
        echo ⚠️  IMPORTANT: Éditer le fichier .env et ajouter vos secrets !
        echo.
        pause
    ) else (
        echo ❌ Pas de fichier .env ni .env.example trouvé
        echo.
        echo Créez un fichier .env avec les variables nécessaires
        pause
        exit /b 1
    )
) else (
    echo ✅ Fichier .env trouvé
    echo.
)

:: ========================================
:: Afficher la configuration
:: ========================================

echo [3/5] ⚙️  Configuration détectée:
echo.

:: Lire quelques variables du .env (sans afficher les secrets)
for /f "tokens=1,2 delims==" %%a in (.env) do (
    set "VAR_NAME=%%a"
    set "VAR_VALUE=%%b"
    
    :: Ignorer les commentaires
    echo %%a | findstr /b "#" >nul
    if not errorlevel 1 goto :SKIP_LINE
    
    :: Masquer les tokens/secrets
    echo %%a | findstr /i "TOKEN SECRET KEY PASSWORD" >nul
    if not errorlevel 1 (
        echo   • %%a = [MASQUÉ]
    ) else (
        echo   • %%a = %%b
    )
    
    :SKIP_LINE
)

echo.

:: ========================================
:: Choix du mode de test
:: ========================================

echo [4/5] 🎯 Mode de test:
echo.
echo 1. Mode normal (npm start)
echo 2. Mode développement avec auto-reload (npm run dev)
echo 3. Annuler
echo.
set /p TEST_MODE="Votre choix (1/2/3): "

if "%TEST_MODE%"=="3" (
    echo ❌ Test annulé
    pause
    exit /b 0
)

:: ========================================
:: Lancement de l'application
:: ========================================

echo.
echo [5/5] 🚀 Lancement de l'application...
echo.
echo ═══════════════════════════════════════════════════════
echo   ℹ️  INSTRUCTIONS
echo ═══════════════════════════════════════════════════════
echo.
echo • L'application va démarrer dans quelques secondes
echo • Ouvrez votre navigateur sur: http://localhost:3000
echo • Health check: http://localhost:3000/health
echo • Logs visibles ci-dessous
echo • Appuyez sur Ctrl+C pour arrêter
echo.
echo ═══════════════════════════════════════════════════════
echo.
echo Hamdoulilah, c'est parti ! 🎉
echo.

timeout /t 3 >nul

if "%TEST_MODE%"=="2" (
    echo [Mode Développement - Auto-reload activé]
    echo.
    call npm run dev
) else (
    echo [Mode Normal]
    echo.
    call npm start
)

:: ========================================
:: Arrêt
:: ========================================

echo.
echo.
echo ═══════════════════════════════════════════════════════
echo   🛑 APPLICATION ARRÊTÉE
echo ═══════════════════════════════════════════════════════
echo.
echo Miskin, l'application s'est arrêtée
echo.
echo Tout s'est bien passé ? (o/n)
set /p SUCCESS="Réponse: "

if /i "%SUCCESS%"=="o" (
    echo.
    echo ✅ Parfait ! Prêt pour Railway ?
    echo.
    echo Prochaines étapes:
    echo 1. Commit les changements: git add . ^&^& git commit -m "Update"
    echo 2. Push vers GitHub: git push
    echo 3. Railway va auto-déployer
    echo.
) else (
    echo.
    echo ⚠️  Qu'est-ce qui n'a pas fonctionné ?
    echo.
    echo Vérifiez:
    echo • Les logs ci-dessus pour les erreurs
    echo • Le fichier .env (variables manquantes ?)
    echo • Les dépendances (npm install à jour ?)
    echo.
    echo Besoin d'aide ? Demande à l'IA de debugger les logs
    echo.
)

pause
