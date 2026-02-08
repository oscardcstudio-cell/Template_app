import { input, select, confirm, checkbox } from '@inquirer/prompts';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  🎯 CONFIGURATION DU PROJET');
console.log('═══════════════════════════════════════════════════════');
console.log('');
console.log('Bienvenue ! Je vais te poser quelques questions pour');
console.log('configurer ton projet correctement.');
console.log('');

async function runSetup() {
    try {
        // ==========================================
        // 1. Type de projet
        // ==========================================
        console.log('📋 Étape 1/5 : Type de projet\n');
        const projectType = await select({
            message: 'Quel type de projet veux-tu créer ?',
            choices: [
                {
                    name: '🤖 Bot (Discord, Telegram, Trading, etc.)',
                    value: 'bot',
                    description: 'Un bot automatisé qui tourne en continu'
                },
                {
                    name: '🌐 API / Service Web',
                    value: 'api',
                    description: 'Une API REST ou un service backend'
                },
                {
                    name: '📊 Dashboard / Interface Web',
                    value: 'dashboard',
                    description: 'Une interface web avec visualisation de données'
                },
                {
                    name: '🔧 Outil / Script',
                    value: 'tool',
                    description: 'Un outil en ligne de commande ou script automatisé'
                },
                {
                    name: '🎮 Autre',
                    value: 'other',
                    description: 'Un projet qui ne rentre pas dans ces catégories'
                }
            ]
        });

        // ==========================================
        // 2. Fonctionnalités principales
        // ==========================================
        console.log('\n📦 Étape 2/5 : Fonctionnalités\n');
        const features = await checkbox({
            message: 'De quoi ton projet aura besoin ? (Espace pour sélectionner, Entrée pour valider)',
            choices: [
                { name: '🗄️  Base de données (SQLite, PostgreSQL, etc.)', value: 'database', checked: false },
                { name: '🌐 Appels API externes', value: 'api-calls', checked: true },
                { name: '📅 Tâches planifiées / Cron jobs', value: 'scheduled-tasks', checked: false },
                { name: '🔐 Authentification utilisateur', value: 'auth', checked: false },
                { name: '📧 Envoi d\'emails', value: 'email', checked: false },
                { name: '📊 Dashboard web', value: 'web-ui', checked: false },
                { name: '📝 Logging avancé', value: 'logging', checked: true }
            ]
        });

        // ==========================================
        // 3. Déploiement
        // ==========================================
        console.log('\n🚀 Étape 3/5 : Déploiement\n');
        const deployment = await select({
            message: 'Comment vas-tu déployer ton projet ?',
            choices: [
                { name: '🚂 Railway', value: 'railway', description: 'Recommandé - Simple et rapide' },
                { name: '☁️  Autre cloud (Heroku, Render, etc.)', value: 'cloud', description: 'Services cloud similaires' },
                { name: '💻 Serveur local / VPS', value: 'local', description: 'Ton propre serveur' },
                { name: '❓ Je ne sais pas encore', value: 'unknown', description: 'Configuration flexible' }
            ],
            default: 'railway'
        });

        // ==========================================
        // 4. Persistance des données
        // ==========================================
        console.log('\n💾 Étape 4/5 : Stockage des données\n');
        const dataNeeds = await confirm({
            message: 'Ton projet a besoin de sauvegarder des données persistantes ?',
            default: true
        });

        let dataType = 'json';
        if (dataNeeds) {
            dataType = await select({
                message: 'Quel type de stockage préfères-tu ?',
                choices: [
                    { name: '📄 Fichiers JSON (simple, léger)', value: 'json', description: 'Parfait pour petits projets' },
                    { name: '🗄️  Base de données SQLite (structuré)', value: 'sqlite', description: 'Bon pour données relationnelles' },
                    { name: '🐘 Base de données externe (PostgreSQL, MySQL)', value: 'external-db', description: 'Pour gros projets' },
                    { name: '📝 Fichiers texte / Markdown', value: 'files', description: 'Pour logs, notes, etc.' }
                ],
                default: 'json'
            });
        }

        // ==========================================
        // 5. Description du projet
        // ==========================================
        console.log('\n📝 Étape 5/5 : Description\n');
        const projectDescription = await input({
            message: 'Décris brièvement ce que fait ton projet :',
            default: 'Une application Node.js déployée sur Railway'
        });

        // ==========================================
        // Génération de la configuration
        // ==========================================
        console.log('\n🔧 Génération de la configuration...\n');

        const config = {
            projectType,
            features,
            deployment,
            dataNeeds,
            dataType,
            description: projectDescription,
            createdAt: new Date().toISOString()
        };

        // Sauvegarder la config
        await fs.writeFile(
            path.join(__dirname, 'data', 'project-config.json'),
            JSON.stringify(config, null, 2)
        );

        // Mettre à jour le README
        await updateReadme(config);

        // Créer les fichiers selon la config
        await createProjectFiles(config);

        // Afficher le résumé
        displaySummary(config);

    } catch (error) {
        if (error.name === 'ExitPromptError') {
            console.log('\n❌ Configuration annulée par l\'utilisateur');
            process.exit(0);
        }
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

// ==========================================
// Mettre à jour le README
// ==========================================
async function updateReadme(config) {
    const readmePath = path.join(__dirname, 'README.md');
    let readme = await fs.readFile(readmePath, 'utf-8');

    // Remplacer la description
    readme = readme.replace(
        /\[Décrire ici ce que fait ton application\]/g,
        config.description
    );

    await fs.writeFile(readmePath, readme);
    console.log('✅ README.md mis à jour');
}

// ==========================================
// Créer les fichiers selon la config
// ==========================================
async function createProjectFiles(config) {
    const { projectType, features, dataType } = config;

    // Créer un fichier ARCHITECTURE.md
    let architectureContent = `# 🏗️ Architecture du Projet\n\n`;
    architectureContent += `## Type de Projet\n${getProjectTypeDescription(projectType)}\n\n`;

    if (features.length > 0) {
        architectureContent += `## Fonctionnalités\n`;
        features.forEach(feature => {
            architectureContent += `- ✅ ${getFeatureDescription(feature)}\n`;
        });
        architectureContent += `\n`;
    }

    architectureContent += `## Stockage\n${getDataTypeDescription(dataType)}\n\n`;
    architectureContent += `## Conseil pour l'IA\n\n`;
    architectureContent += `L'utilisateur ne sait pas coder. Quand tu codes :\n`;
    architectureContent += `- Explique en termes simples ce que tu fais\n`;
    architectureContent += `- Crée TOUS les fichiers nécessaires\n`;
    architectureContent += `- Utilise occasionnellement: hamdoulilah, starfoula, miskin\n`;
    architectureContent += `- Gère toutes les erreurs proprement\n`;
    architectureContent += `- Logs clairs avec emojis\n`;

    await fs.writeFile(path.join(__dirname, 'ARCHITECTURE.md'), architectureContent);
    console.log('✅ ARCHITECTURE.md créé');

    // Créer des fichiers de base selon les features
    if (features.includes('database')) {
        await createDatabaseSetup();
    }

    if (features.includes('scheduled-tasks')) {
        await createSchedulerFile();
    }

    if (features.includes('web-ui')) {
        await createWebUISetup();
    }
}

// ==========================================
// Fonctions helpers
// ==========================================
function getProjectTypeDescription(type) {
    const descriptions = {
        'bot': '🤖 **Bot automatisé** - Processus qui tourne en continu pour exécuter des tâches automatiques',
        'api': '🌐 **API / Service Web** - Backend qui expose des endpoints pour clients externes',
        'dashboard': '📊 **Dashboard** - Interface web pour visualiser et gérer des données',
        'tool': '🔧 **Outil** - Script ou CLI pour automatiser des tâches',
        'other': '🎮 **Projet personnalisé**'
    };
    return descriptions[type] || type;
}

function getFeatureDescription(feature) {
    const descriptions = {
        'database': 'Base de données pour stockage structuré',
        'api-calls': 'Appels vers APIs externes',
        'scheduled-tasks': 'Tâches planifiées (cron jobs)',
        'auth': 'Authentification utilisateur',
        'email': 'Envoi d\'emails',
        'web-ui': 'Interface web / Dashboard',
        'logging': 'Système de logging avancé'
    };
    return descriptions[feature] || feature;
}

function getDataTypeDescription(type) {
    const descriptions = {
        'json': '📄 **Fichiers JSON** - Stockage simple dans des fichiers .json',
        'sqlite': '🗄️ **SQLite** - Base de données locale embarquée',
        'external-db': '🐘 **Base de données externe** - PostgreSQL, MySQL, MongoDB, etc.',
        'files': '📝 **Fichiers texte** - Logs, notes, markdown'
    };
    return descriptions[type] || 'Pas de persistance';
}

async function createDatabaseSetup() {
    // Créer un fichier d'exemple pour la DB
    const dbSetupContent = `// Configuration base de données
// TODO: Implémenter la connexion selon tes besoins
// Voir ARCHITECTURE.md pour les détails
`;
    await fs.mkdir(path.join(__dirname, 'src', 'database'), { recursive: true });
    await fs.writeFile(
        path.join(__dirname, 'src', 'database', 'setup.js'),
        dbSetupContent
    );
    console.log('✅ Structure database créée');
}

async function createSchedulerFile() {
    const schedulerContent = `// Tâches planifiées
// TODO: Configurer les cron jobs
// Voir ARCHITECTURE.md pour les détails
`;
    await fs.writeFile(
        path.join(__dirname, 'src', 'scheduler.js'),
        schedulerContent
    );
    console.log('✅ Fichier scheduler créé');
}

async function createWebUISetup() {
    await fs.mkdir(path.join(__dirname, 'public'), { recursive: true });
    const indexHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
</head>
<body>
    <h1>🚀 Dashboard</h1>
    <p>Interface en cours de développement...</p>
</body>
</html>`;
    await fs.writeFile(path.join(__dirname, 'public', 'index.html'), indexHtml);
    console.log('✅ Structure web UI créée');
}

// ==========================================
// Afficher le résumé
// ==========================================
function displaySummary(config) {
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  ✅ CONFIGURATION TERMINÉE !');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📋 Résumé de ton projet :');
    console.log('');
    console.log(`  Type        : ${getProjectTypeDescription(config.projectType)}`);
    console.log(`  Features    : ${config.features.length > 0 ? config.features.join(', ') : 'Aucune'}`);
    console.log(`  Déploiement : ${config.deployment}`);
    console.log(`  Stockage    : ${config.dataType}`);
    console.log('');
    console.log('📝 Fichiers créés :');
    console.log('  ✅ data/project-config.json');
    console.log('  ✅ ARCHITECTURE.md');
    console.log('  ✅ README.md (mis à jour)');
    if (config.features.includes('database')) {
        console.log('  ✅ src/database/setup.js');
    }
    if (config.features.includes('scheduled-tasks')) {
        console.log('  ✅ src/scheduler.js');
    }
    if (config.features.includes('web-ui')) {
        console.log('  ✅ public/index.html');
    }
    console.log('');
    console.log('🎯 Prochaines étapes :');
    console.log('');
    console.log('  1. Lis le fichier ARCHITECTURE.md');
    console.log('  2. Demande à l\'IA de commencer à coder selon ta config');
    console.log('  3. Teste en local avec: npm run dev');
    console.log('  4. Déploie sur Railway quand prêt');
    console.log('');
    console.log('Hamdoulilah, ton projet est configuré ! 🎉');
    console.log('');
}

// Lancer le setup
runSetup();
