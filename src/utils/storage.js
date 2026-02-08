import { promises as fs } from 'fs';
import { join } from 'path';
import config from '../config.js';

// ==========================================
// Gestion du stockage persistant
// ==========================================

/**
 * Crée le dossier data s'il n'existe pas
 */
async function ensureDataDirectory() {
    try {
        await fs.mkdir(config.DATA_PATH, { recursive: true });
    } catch (error) {
        console.log('[ERROR] ❌ Impossible de créer le dossier data:', error.message);
        throw error;
    }
}

/**
 * Charge un fichier JSON depuis le dossier data
 */
export async function loadJSON(filename) {
    try {
        await ensureDataDirectory();
        const filePath = join(config.DATA_PATH, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Fichier n'existe pas, retourner null
            return null;
        }
        console.log(`[ERROR] ❌ Erreur lors de la lecture de ${filename}:`, error.message);
        throw error;
    }
}

/**
 * Sauvegarde un objet en JSON dans le dossier data
 */
export async function saveJSON(filename, data) {
    try {
        await ensureDataDirectory();
        const filePath = join(config.DATA_PATH, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.log(`[ERROR] ❌ Erreur lors de la sauvegarde de ${filename}:`, error.message);
        throw error;
    }
}

/**
 * Charge l'état de l'application
 */
export async function loadState() {
    return await loadJSON('state.json');
}

/**
 * Sauvegarde l'état de l'application
 */
export async function saveState(state) {
    return await saveJSON('state.json', state);
}

/**
 * Charge l'historique
 */
export async function loadHistory() {
    return await loadJSON('history.json') || [];
}

/**
 * Sauvegarde l'historique
 */
export async function saveHistory(history) {
    return await saveJSON('history.json', history);
}

/**
 * Ajoute une entrée à l'historique
 */
export async function addToHistory(entry) {
    const history = await loadHistory();
    history.push({
        ...entry,
        timestamp: new Date().toISOString()
    });
    await saveHistory(history);
}

/**
 * Lit le contenu du backlog.md
 */
export async function loadBacklog() {
    try {
        await ensureDataDirectory();
        const filePath = join(config.DATA_PATH, 'backlog.md');
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            return '# 📝 Backlog\n\n(Vide pour le moment)\n';
        }
        throw error;
    }
}

/**
 * Écrit dans le backlog.md
 */
export async function saveBacklog(content) {
    await ensureDataDirectory();
    const filePath = join(config.DATA_PATH, 'backlog.md');
    await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Ajoute une note au backlog
 */
export async function addToBacklog(note) {
    const backlog = await loadBacklog();
    const timestamp = new Date().toISOString();
    const newEntry = `\n## ${timestamp}\n\n${note}\n`;
    await saveBacklog(backlog + newEntry);
}
