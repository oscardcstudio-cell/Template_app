import rateLimit from 'express-rate-limit';

// ==========================================
// Rate Limiting Configurations
// ==========================================

/**
 * Rate limiter général pour toutes les routes
 * Limite à 100 requêtes par 15 minutes par IP
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite de 100 requêtes
    message: {
        error: true,
        message: 'Trop de requêtes, réessaye dans 15 minutes'
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

/**
 * Rate limiter strict pour les API endpoints
 * Limite à 30 requêtes par 5 minutes par IP
 */
export const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 30, // Limite de 30 requêtes
    message: {
        error: true,
        message: 'Trop de requêtes API, réessaye dans 5 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter très strict pour les endpoints de création/modification
 * Limite à 10 requêtes par 10 minutes par IP
 * Pour prévenir spam et abus
 */
export const strictLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // Limite de 10 requêtes
    message: {
        error: true,
        message: 'Trop de requêtes. Limite atteinte, réessaye dans 10 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
