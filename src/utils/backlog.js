import { promises as fs } from 'fs';
import path from 'path';
import config from '../config.js';
import { v4 as uuidv4 } from 'uuid';

// ==========================================
// Gestion du Backlog (Tâches et Bugs)
// ==========================================

const BACKLOG_FILE = path.join(config.dataPath, 'backlog.json');

/**
 * Charger le backlog
 */
export async function loadBacklog() {
    try {
        await fs.access(BACKLOG_FILE);
        const data = await fs.readFile(BACKLOG_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        // Fichier n'existe pas encore
        return {
            items: [],
            lastUpdated: new Date().toISOString()
        };
    }
}

/**
 * Sauvegarder le backlog
 */
export async function saveBacklog(backlog) {
    backlog.lastUpdated = new Date().toISOString();
    await fs.writeFile(BACKLOG_FILE, JSON.stringify(backlog, null, 2));
    console.log('[INFO] 💾 Backlog sauvegardé');
}

/**
 * Ajouter un item
 */
export async function addBacklogItem(text, type = 'idea') {
    const backlog = await loadBacklog();

    const newItem = {
        id: uuidv4(),
        text,
        type, // 'bug' ou 'idea'
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    backlog.items.push(newItem);
    await saveBacklog(backlog);

    console.log(`[INFO] ✅ Backlog item ajouté: ${type === 'bug' ? '🐛' : '💡'} ${text.substring(0, 50)}...`);

    return newItem;
}

/**
 * Toggle completion status
 */
export async function toggleBacklogItem(id) {
    const backlog = await loadBacklog();
    const item = backlog.items.find(i => i.id === id);

    if (!item) {
        throw new Error('Item introuvable');
    }

    item.completed = !item.completed;
    item.completedAt = item.completed ? new Date().toISOString() : null;

    await saveBacklog(backlog);

    console.log(`[INFO] ${item.completed ? '✅' : '↩️'} Item ${item.completed ? 'complété' : 'réactivé'}: ${item.text.substring(0, 50)}...`);

    return item;
}

/**
 * Supprimer un item
 */
export async function deleteBacklogItem(id) {
    const backlog = await loadBacklog();
    const index = backlog.items.findIndex(i => i.id === id);

    if (index === -1) {
        throw new Error('Item introuvable');
    }

    const deleted = backlog.items.splice(index, 1)[0];
    await saveBacklog(backlog);

    console.log(`[INFO] 🗑️ Item supprimé: ${deleted.text.substring(0, 50)}...`);

    return deleted;
}

/**
 * Obtenir les statistiques
 */
export async function getBacklogStats() {
    const backlog = await loadBacklog();

    const total = backlog.items.length;
    const bugs = backlog.items.filter(i => i.type === 'bug' && !i.completed).length;
    const ideas = backlog.items.filter(i => i.type === 'idea' && !i.completed).length;
    const completed = backlog.items.filter(i => i.completed).length;
    const active = total - completed;

    return {
        total,
        bugs,
        ideas,
        completed,
        active
    };
}

/**
 * Exporter le backlog en markdown (pour l'IA)
 */
export async function exportBacklogToMarkdown() {
    const backlog = await loadBacklog();
    const stats = await getBacklogStats();

    let md = `# 📝 Backlog - Tâches et Bugs\n\n`;
    md += `> Dernière mise à jour: ${new Date(backlog.lastUpdated).toLocaleString('fr-FR')}\n\n`;
    md += `## 📊 Statistiques\n\n`;
    md += `- **Total**: ${stats.total} items\n`;
    md += `- **En cours**: ${stats.active} items\n`;
    md += `- **Bugs**: ${stats.bugs} 🐛\n`;
    md += `- **Idées**: ${stats.ideas} 💡\n`;
    md += `- **Terminées**: ${stats.completed} ✅\n\n`;

    // Bugs actifs
    const activeBugs = backlog.items.filter(i => i.type === 'bug' && !i.completed);
    if (activeBugs.length > 0) {
        md += `## 🐛 Bugs à Corriger\n\n`;
        activeBugs.forEach((item, index) => {
            const date = new Date(item.createdAt).toLocaleDateString('fr-FR');
            md += `${index + 1}. **${item.text}**\n`;
            md += `   - ID: \`${item.id}\`\n`;
            md += `   - Créé le: ${date}\n\n`;
        });
    }

    // Idées actives
    const activeIdeas = backlog.items.filter(i => i.type === 'idea' && !i.completed);
    if (activeIdeas.length > 0) {
        md += `## 💡 Idées à Implémenter\n\n`;
        activeIdeas.forEach((item, index) => {
            const date = new Date(item.createdAt).toLocaleDateString('fr-FR');
            md += `${index + 1}. **${item.text}**\n`;
            md += `   - ID: \`${item.id}\`\n`;
            md += `   - Créé le: ${date}\n\n`;
        });
    }

    // Items complétés
    const completedItems = backlog.items.filter(i => i.completed);
    if (completedItems.length > 0) {
        md += `## ✅ Terminées\n\n`;
        completedItems.forEach((item, index) => {
            const date = new Date(item.completedAt).toLocaleDateString('fr-FR');
            md += `${index + 1}. ~~${item.text}~~ (${date})\n`;
        });
    }

    return md;
}
