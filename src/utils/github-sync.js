import { exec } from 'child_process';
import { promisify } from 'util';
import config from '../config.js';

const execAsync = promisify(exec);

// ==========================================
// GitHub Auto-Sync
// ==========================================

/**
 * Configure Git avec le token GitHub
 */
async function configureGit() {
    if (!config.GITHUB_ENABLED) {
        throw new Error('GitHub non configuré (GITHUB_TOKEN ou GITHUB_REPO manquant)');
    }

    try {
        // Configure Git pour utiliser le token
        const [owner, repo] = config.GITHUB_REPO.split('/');
        const remoteUrl = `https://${config.GITHUB_TOKEN}@github.com/${owner}/${repo}.git`;

        // Vérifie si le remote existe, sinon le crée
        try {
            await execAsync('git remote get-url origin');
            // Le remote existe déjà, le mettre à jour
            await execAsync(`git remote set-url origin ${remoteUrl}`);
        } catch {
            // Le remote n'existe pas, le créer
            await execAsync(`git remote add origin ${remoteUrl}`);
        }

        // Configure l'identité Git (nécessaire pour commit)
        await execAsync('git config user.email "bot@railway.app"');
        await execAsync('git config user.name "Railway Bot"');

    } catch (error) {
        console.log('[ERROR] ❌ Erreur lors de la configuration Git:', error.message);
        throw error;
    }
}

/**
 * Synchronise les changements avec GitHub
 */
export async function syncToGitHub(commitMessage = 'Auto-sync: update data') {
    if (!config.GITHUB_ENABLED) {
        console.log('[WARNING] ⚠️ GitHub sync désactivé');
        return false;
    }

    try {
        // Configure Git
        await configureGit();

        // Ajoute les changements dans le dossier data (seulement backlog.md et autres fichiers non-ignorés)
        await execAsync('git add data/backlog.md');

        // Vérifie s'il y a des changements à commit
        const { stdout: status } = await execAsync('git status --porcelain');

        if (!status.trim()) {
            console.log('[INFO] 📝 Pas de changements à synchroniser');
            return false;
        }

        // Commit les changements
        await execAsync(`git commit -m "${commitMessage}"`);

        // Push vers GitHub
        await execAsync('git push origin main');

        console.log('[SUCCESS] ✅ Synchronisation GitHub réussie');
        return true;

    } catch (error) {
        // Ne pas crasher si le sync échoue
        console.log('[WARNING] ⚠️ Échec du sync GitHub:', error.message);
        return false;
    }
}

/**
 * Pull les derniers changements depuis GitHub
 */
export async function pullFromGitHub() {
    if (!config.GITHUB_ENABLED) {
        console.log('[WARNING] ⚠️ GitHub sync désactivé');
        return false;
    }

    try {
        await configureGit();
        await execAsync('git pull origin main');
        console.log('[SUCCESS] ✅ Pull GitHub réussi');
        return true;
    } catch (error) {
        console.log('[WARNING] ⚠️ Échec du pull GitHub:', error.message);
        return false;
    }
}

/**
 * Vérifie le statut Git
 */
export async function getGitStatus() {
    try {
        const { stdout } = await execAsync('git status --porcelain');
        return stdout.trim();
    } catch (error) {
        console.log('[ERROR] ❌ Erreur lors de la vérification du statut Git:', error.message);
        return null;
    }
}
