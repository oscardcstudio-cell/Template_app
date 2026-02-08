import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==========================================
// Configuration de l'application
// ==========================================

const config = {
    // Environnement
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,

    // Chemins
    DATA_PATH: process.env.DATA_PATH || join(__dirname, '..', 'data'),

    // GitHub
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
    GITHUB_REPO: process.env.GITHUB_REPO || '',
    GITHUB_ENABLED: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO),

    // [Ajouter tes propres variables de configuration ici]
    // Exemple:
    // API_KEY: process.env.API_KEY || '',
    // DATABASE_URL: process.env.DATABASE_URL || '',
};

// ==========================================
// Validation de la configuration
// ==========================================

function validateConfig() {
    const warnings = [];
    const errors = [];

    // Vérifications critiques
    if (!config.PORT) {
        errors.push('PORT est requis');
    }

    if (!config.DATA_PATH) {
        errors.push('DATA_PATH est requis');
    }

    // Vérifications optionnelles (warnings)
    if (!config.GITHUB_ENABLED) {
        warnings.push('GitHub auto-sync désactivé (GITHUB_TOKEN ou GITHUB_REPO manquant)');
    }

    // Affichage des warnings
    if (warnings.length > 0) {
        console.log('[WARNING] ⚠️ Configuration incomplète:');
        warnings.forEach(w => console.log(`  - ${w}`));
    }

    // Affichage des erreurs et arrêt si nécessaire
    if (errors.length > 0) {
        console.log('[ERROR] ❌ Configuration invalide:');
        errors.forEach(e => console.log(`  - ${e}`));
        process.exit(1);
    }

    console.log('[SUCCESS] ✅ Configuration validée');
}

// Validation au démarrage
validateConfig();

export default config;
