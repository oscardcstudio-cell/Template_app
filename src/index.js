import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { syncToGitHub } from './utils/github-sync.js';
import { loadState, saveState } from './utils/storage.js';
import {
    loadBacklog,
    addBacklogItem,
    toggleBacklogItem,
    deleteBacklogItem,
    exportBacklogToMarkdown
} from './utils/backlog.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generalLimiter, apiLimiter, strictLimiter } from './middleware/rateLimiter.js';
import { validateBacklogInput } from './middleware/validator.js';
import config from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==========================================
// Middlewares de Sécurité et Performance
// ==========================================

// Helmet: Headers de sécurité HTTP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"], // Pour backlog-widget.css
            scriptSrc: ["'self'", "'unsafe-inline'"], // Pour backlog-widget.js
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}));

// Compression des réponses
app.use(compression());

// Rate limiting général (sur toutes les routes)
app.use(generalLimiter);

// Parser JSON
app.use(express.json());

// Servir les fichiers statiques (backlog widget)
app.use(express.static(path.join(__dirname, '..', 'public')));

// ==========================================
// État de l'application
// ==========================================
let appState = {
    startTime: new Date().toISOString(),
    version: '1.0.0',
    status: 'initializing'
};

// ==========================================
// Routes
// ==========================================

app.get('/', (req, res) => {
    res.json({
        message: '🚀 Application en cours d\'exécution',
        status: appState.status,
        uptime: Math.floor((Date.now() - new Date(appState.startTime)) / 1000),
        version: appState.version
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
    });
});

// ==========================================
// API Backlog (avec rate limiting et validation)
// ==========================================

// Appliquer le rate limiter API à tous les endpoints /api/*
app.use('/api/', apiLimiter);

// GET /api/backlog - Récupérer toutes les tâches
app.get('/api/backlog', async (req, res, next) => {
    try {
        const backlog = await loadBacklog();
        res.json(backlog);
    } catch (error) {
        next(error); // Passer à l'error handler
    }
});

// POST /api/backlog - Ajouter une tâche (avec validation et rate limiting strict)
app.post('/api/backlog', strictLimiter, validateBacklogInput, async (req, res, next) => {
    try {
        const { text, type } = req.body;
        const item = await addBacklogItem(text, type);
        res.json(item);
    } catch (error) {
        next(error);
    }
});

// POST /api/backlog/:id/toggle - Toggle completion
app.post('/api/backlog/:id/toggle', async (req, res, next) => {
    try {
        const item = await toggleBacklogItem(req.params.id);
        res.json(item);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/backlog/:id - Supprimer une tâche (avec rate limiting strict)
app.delete('/api/backlog/:id', strictLimiter, async (req, res, next) => {
    try {
        const deleted = await deleteBacklogItem(req.params.id);
        res.json({ success: true, deleted });
    } catch (error) {
        next(error);
    }
});

// GET /api/backlog/export/markdown - Export markdown pour l'IA
app.get('/api/backlog/export/markdown', async (req, res, next) => {
    try {
        const markdown = await exportBacklogToMarkdown();
        res.type('text/markdown').send(markdown);
    } catch (error) {
        next(error);
    }
});

// ==========================================
// Initialisation
// ==========================================

async function initialize() {
    try {
        console.log('[INFO] 🚀 Démarrage de l\'application...');

        // Charger l'état persistant
        const savedState = await loadState();
        if (savedState) {
            appState = { ...appState, ...savedState };
            console.log('[SUCCESS] ✅ État chargé depuis le stockage');
        }

        appState.status = 'running';
        await saveState(appState);

        console.log('[SUCCESS] ✅ Application initialisée');
        console.log(`[INFO] 📊 Version: ${appState.version}`);
        console.log(`[INFO] 📊 Environnement: ${config.NODE_ENV}`);
        console.log(`[INFO] 🛡️ Sécurité: Helmet + Rate Limiting + Compression activés`);

    } catch (error) {
        console.log('[ERROR] ❌ Erreur lors de l\'initialisation:', error.message);
        appState.status = 'error';
    }
}

// ==========================================
// Auto-sync GitHub (toutes les 30 minutes)
// ==========================================

if (config.GITHUB_ENABLED) {
    setInterval(async () => {
        try {
            console.log('[INFO] 🔄 Synchronisation GitHub...');
            await syncToGitHub('Auto-sync: update data');
            console.log('[SUCCESS] ✅ Synchronisation GitHub réussie');
        } catch (error) {
            console.log('[WARNING] ⚠️ Échec de la synchronisation GitHub:', error.message);
        }
    }, 30 * 60 * 1000); // 30 minutes
}

// ==========================================
// Sauvegarde périodique de l'état (toutes les 5 minutes)
// ==========================================

setInterval(async () => {
    try {
        await saveState(appState);
        console.log('[INFO] 💾 État sauvegardé');
    } catch (error) {
        console.log('[WARNING] ⚠️ Échec de la sauvegarde:', error.message);
    }
}, 5 * 60 * 1000); // 5 minutes

// ==========================================
// Gestion de l'arrêt gracieux
// ==========================================

process.on('SIGTERM', async () => {
    console.log('[INFO] 🛑 Signal SIGTERM reçu, arrêt gracieux...');
    appState.status = 'shutting_down';
    await saveState(appState);
    if (config.GITHUB_ENABLED) {
        await syncToGitHub('Shutdown: final sync');
    }
    process.exit(0);
});

// ==========================================
// Error Handlers (doivent être en dernier)
// ==========================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ==========================================
// Démarrage du serveur
// ==========================================

app.listen(config.PORT, async () => {
    console.log(`[SUCCESS] ✅ Serveur démarré sur le port ${config.PORT}`);
    console.log(`[INFO] 🌐 URL: http://localhost:${config.PORT}`);
    console.log(`[INFO] 📡 Health check: http://localhost:${config.PORT}/health`);

    // Hamdoulilah, tout est prêt !
    console.log('[INFO] 🎉 Hamdoulilah, l\'application est prête !');

    await initialize();
});
