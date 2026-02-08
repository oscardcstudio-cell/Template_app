import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'setup-ui')));

const PORT = 3456;
const TOKEN_FILE = path.join(__dirname, '.saved-token.json');

// ==========================================
// Route pour sauvegarder le token
// ==========================================
app.post('/api/save-token', async (req, res) => {
    try {
        const { githubToken } = req.body;
        await fs.writeFile(TOKEN_FILE, JSON.stringify({ token: githubToken }, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// Route pour récupérer le token sauvegardé
// ==========================================
app.get('/api/get-saved-token', async (req, res) => {
    try {
        const data = await fs.readFile(TOKEN_FILE, 'utf-8');
        const { token } = JSON.parse(data);
        res.json({ token });
    } catch {
        res.json({ token: null });
    }
});

// ==========================================
// Route pour créer le projet (code existant)
// ==========================================
app.post('/api/create-project', async (req, res) => {
    try {
        const {
            projectName,
            destinationPath,
            githubRepo,
            githubToken,
            extraSecrets
        } = req.body;

        console.log(`[INFO] 🚀 Création du projet: ${projectName}`);

        // Valider les entrées
        if (!projectName) {
            return res.status(400).json({ error: 'Le nom du projet est requis' });
        }

        if (!githubRepo) {
            return res.status(400).json({ error: 'Le repo GitHub est requis' });
        }

        if (!githubToken) {
            return res.status(400).json({ error: 'Le token GitHub est requis' });
        }

        const destPath = destinationPath || 'C:\\Users\\oscar\\APPS';
        const projectPath = path.join(destPath, projectName);

        // Vérifier si le dossier existe déjà
        try {
            await fs.access(projectPath);
            return res.status(400).json({ error: 'Un projet avec ce nom existe déjà dans ce dossier' });
        } catch {
            // Le dossier n'existe pas, c'est bon
        }

        // Créer le dossier de destination
        await fs.mkdir(destPath, { recursive: true });

        // IMPORTANT: Le template est TOUJOURS dans C:\Users\oscar\APPS\TEMPLATE_APP
        // On ne copie JAMAIS depuis __dirname car si le script est lancé depuis un projet créé, ça fait une boucle infinie
        const templatePath = 'C:\\Users\\oscar\\APPS\\TEMPLATE_APP';

        // Vérifier que le template existe
        try {
            await fs.access(templatePath);
        } catch {
            return res.status(500).json({
                error: 'Template introuvable',
                details: `Le dossier TEMPLATE_APP doit être dans C:\\Users\\oscar\\APPS\\TEMPLATE_APP`
            });
        }

        // S'assurer qu'on ne copie pas le template dans lui-même
        if (path.resolve(projectPath) === path.resolve(templatePath)) {
            return res.status(400).json({
                error: 'Impossible de créer le template dans lui-même !',
                details: 'Choisis un autre nom de projet'
            });
        }

        // Copier le template
        console.log('[INFO] 📋 Copie du template...');
        console.log(`[INFO] 📂 Depuis: ${templatePath}`);
        console.log(`[INFO] 📂 Vers: ${projectPath}`);

        await copyDirectory(templatePath, projectPath, [
            'node_modules',
            'setup-ui',
            'setup-server.js',
            'setup-new-project.bat',
            '.saved-token.json',
            '.git'
        ]);

        // Créer le fichier .env
        console.log('[INFO] 🔐 Création du .env...');
        let envContent = `# Configuration du projet ${projectName}
NODE_ENV=development
PORT=3000
DATA_PATH=./data

# GitHub
GITHUB_TOKEN=${githubToken}
GITHUB_REPO=${githubRepo}

`;

        // Ajouter les secrets supplémentaires
        if (extraSecrets) {
            envContent += '# Secrets supplémentaires\n';
            Object.entries(extraSecrets).forEach(([key, value]) => {
                envContent += `${key}=${value}\n`;
            });
        }

        await fs.writeFile(path.join(projectPath, '.env'), envContent);

        // Créer .env.example
        const envExampleContent = `# Configuration du projet ${projectName}
NODE_ENV=development
PORT=3000
DATA_PATH=./data

# GitHub
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=${githubRepo}
`;
        await fs.writeFile(path.join(projectPath, '.env.example'), envExampleContent);

        // Initialiser Git
        console.log('[INFO] 🔧 Initialisation Git...');
        try {
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);

            await execAsync('git init', { cwd: projectPath, timeout: 30000 });
            console.log('[SUCCESS] ✅ Git initialisé');
        } catch (error) {
            console.error('[WARNING] ⚠️ Git init échoué:', error.message);
        }

        // Configurer le remote si le repo est fourni
        if (githubRepo) {
            try {
                const { exec } = await import('child_process');
                const { promisify } = await import('util');
                const execAsync = promisify(exec);

                await execAsync(`git remote add origin https://github.com/${githubRepo}.git`, { cwd: projectPath, timeout: 10000 });
                console.log('[SUCCESS] ✅ Remote GitHub configuré');
            } catch (error) {
                console.error('[WARNING] ⚠️ Config remote échouée:', error.message);
            }
        }

        // Installer les dépendances
        console.log('[INFO] 📦 Installation des dépendances...');
        console.log('[INFO] ⏳ Ceci peut prendre 30-60 secondes...');
        let npmInstallSuccess = false;
        try {
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);

            await execAsync('npm install', { cwd: projectPath, timeout: 120000 }); // 2 minutes max
            console.log('[SUCCESS] ✅ Dépendances installées');
            npmInstallSuccess = true;
        } catch (error) {
            console.error('[WARNING] ⚠️ Installation dépendances échouée:', error.message);
            console.error('[INFO] 💡 Tu pourras les installer manuellement avec: npm install');
        }

        // Personnaliser le README
        const readmePath = path.join(projectPath, 'README.md');
        let readme = await fs.readFile(readmePath, 'utf-8');
        readme = readme.replace(/\[Nom du Projet\]/g, projectName);
        await fs.writeFile(readmePath, readme);

        // Sauvegarder le token pour la prochaine fois
        await fs.writeFile(TOKEN_FILE, JSON.stringify({ token: githubToken }, null, 2));

        console.log('[SUCCESS] ✅ Projet créé avec succès !');

        res.json({
            success: true,
            projectPath,
            npmInstallSuccess,
            message: 'Projet créé avec succès ! Hamdoulilah ! 🎉'
        });

    } catch (error) {
        console.error('[ERROR] ❌ Erreur:', error);
        res.status(500).json({
            error: 'Erreur lors de la création du projet',
            details: error.message
        });
    }
});

// ==========================================
// Fonction pour copier un dossier
// ==========================================
let filesCopied = 0;

async function copyDirectory(src, dest, exclude = [], isRoot = true) {
    try {
        if (isRoot) {
            filesCopied = 0;
            console.log(`[INFO] 📂 Source: ${src}`);
            console.log(`[INFO] 📂 Destination: ${dest}`);
        }

        await fs.mkdir(dest, { recursive: true });

        const entries = await fs.readdir(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            // Ignorer les dossiers/fichiers exclus
            if (exclude.includes(entry.name)) {
                console.log(`[INFO] ⏭️  Ignoré: ${entry.name}`);
                continue;
            }

            if (entry.isDirectory()) {
                console.log(`[INFO] 📁 Dossier: ${entry.name}`);
                await copyDirectory(srcPath, destPath, exclude, false);
            } else {
                filesCopied++;
                if (filesCopied % 5 === 0) {
                    console.log(`[INFO] 📄 ${filesCopied} fichiers copiés...`);
                }
                await fs.copyFile(srcPath, destPath);
            }
        }

        if (isRoot) {
            console.log(`[SUCCESS] ✅ Copie terminée: ${filesCopied} fichiers au total`);
        }
    } catch (error) {
        console.error(`[ERROR] ❌ Erreur lors de la copie:`, error.message);
        throw error;
    }
}

// ==========================================
// Démarrer le serveur
// ==========================================
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🚀 SERVEUR DE SETUP - DÉMARRÉ');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log(`  📡 URL: ${url}`);
    console.log('');
    console.log('  👉 CTRL + Clic sur le lien ci-dessus pour ouvrir');
    console.log('  👉 Ou copiez l\'URL dans votre navigateur');
    console.log('');
    console.log('  ⚠️  Appuyez sur Ctrl+C pour arrêter le serveur');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('Hamdoulilah, le serveur est prêt ! 🎉');
    console.log('');
});
