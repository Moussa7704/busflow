const roles = require("../constants/roles");

/**
 * SaaS GLOBAL CONTEXT MIDDLEWARE
 * - Inject company scope
 * - Protect multi-tenant access
 */
const saasContext = (req, res, next) => {
    try {

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Utilisateur non authentifié"
            });
        }

        const role = user.Role?.name;

        // =========================
        // 1. SUPER ADMIN (FULL ACCESS)
        // =========================
        if (role === roles.SUPER_ADMIN) {
            req.saas = {
                scope: "GLOBAL",
                compagny_id: null,
                agency_id: null
            };
        }

        // =========================
        // 2. COMPANY ADMIN
        // =========================
        else if (role === roles.COMPAGNY_ADMIN) {
            req.saas = {
                scope: "COMPANY",
                compagny_id: user.compagny_id,
                agency_id: null
            };
        }

        // =========================
        // 3. AGENCY ADMIN
        // =========================
        else if (role === roles.AGENCY_ADMIN) {
            req.saas = {
                scope: "AGENCY",
                compagny_id: user.compagny_id,
                agency_id: user.agency_id
            };
        }

        // =========================
        // 4. DEFAULT USER
        // =========================
        else {
            req.saas = {
                scope: "USER",
                compagny_id: user.compagny_id,
                agency_id: user.agency_id
            };
        }

        next();

    } catch (error) {
        return res.status(500).json({
            message: "Erreur SaaS middleware",
            error: error.message
        });
    }
};

module.exports = saasContext;