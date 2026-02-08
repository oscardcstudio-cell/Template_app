// ==========================================
// Input Validation and Sanitization
// ==========================================

/**
 * Valider et sanitizer le texte d'un item backlog
 */
export function validateBacklogText(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('Le texte est requis et doit être une chaîne de caractères');
    }

    // Nettoyer les espaces
    const cleaned = text.trim();

    // Vérifier la longueur
    if (cleaned.length === 0) {
        throw new Error('Le texte ne peut pas être vide');
    }

    if (cleaned.length > 500) {
        throw new Error('Le texte ne peut pas dépasser 500 caractères');
    }

    // Échapper les caractères HTML pour prévenir XSS
    const sanitized = cleaned
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');

    return sanitized;
}

/**
 * Valider le type d'un item backlog
 */
export function validateBacklogType(type) {
    const validTypes = ['bug', 'idea'];

    if (!type) {
        return 'idea'; // Valeur par défaut
    }

    if (!validTypes.includes(type)) {
        throw new Error('Le type doit être "bug" ou "idea"');
    }

    return type;
}

/**
 * Valider un UUID
 */
export function validateUUID(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!id || !uuidRegex.test(id)) {
        throw new Error('ID invalide');
    }

    return id;
}

/**
 * Middleware pour valider les requêtes backlog POST
 */
export function validateBacklogInput(req, res, next) {
    try {
        const { text, type } = req.body;

        // Valider et sanitizer
        req.body.text = validateBacklogText(text);
        req.body.type = validateBacklogType(type);

        next();
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        });
    }
}
