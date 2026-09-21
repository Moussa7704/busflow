const { Compagny } = require("../models");

/**
 * Empêche la création de ressources (bus, voyage, agence, utilisateur, passager...)
 * sous une compagnie suspendue ou désactivée.
 */
const assertCompagnyActive = async (compagny_id, transaction) => {

    const compagny = await Compagny.findByPk(compagny_id, transaction ? { transaction } : undefined);

    if (!compagny) {
        throw new Error("Compagnie introuvable.");
    }

    if (compagny.status && compagny.status !== "ACTIVE") {
        throw new Error(
            `Cette compagnie est ${compagny.status === "SUSPENDED" ? "suspendue" : "désactivée"}. Action impossible.`
        );
    }

    return compagny;

};

module.exports = { assertCompagnyActive };
