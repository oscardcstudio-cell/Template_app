// ==========================================
// Error Handler Middleware
// ==========================================

/**
 * Middleware centralisé de gestion d'erreurs
 * À placer en dernier dans le stack de middlewares
 */
export function errorHandler(err, req, res, next) {
    // Logger l'erreur complète côté serveur
    console.error('[ERROR] ❌ Erreur capturée:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Déterminer le code de status
    const statusCode = err.statusCode || err.status || 500;

    // En développement, on expose plus de détails
    const isDev = process.env.NODE_ENV !== 'production';

    // Réponse formatée
    res.status(statusCode).json({
        error: true,
        message: isDev ? err.message : 'Une erreur est survenue',
        ...(isDev && {
            stack: err.stack,
            path: req.path
        })
    });
}

/**
 * Middleware pour gérer les routes non trouvées (404)
 */
export function notFoundHandler(req, res) {
    res.status(404).json({
        error: true,
        message: 'Route introuvable',
        path: req.path
    });
}
