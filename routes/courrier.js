const express = require("express");
const router = express.Router();

const courrierController = require("../controllers/courrier.controller");
const roles = require("../constants/roles");

const {
    authenticate,
    authorize
} = require("../middlewares/auth");

// Enregistrement d'un courrier
router.post(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT,
        roles.COURRIER
    ),
    courrierController.createCourrier
);

// Liste des courriers
router.get(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT,
        roles.COURRIER
    ),
    courrierController.listCourriers
);

// Suivi par numéro de tracking
router.get(
    "/tracking/:tracking_number",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT,
        roles.COURRIER
    ),
    courrierController.getCourrierByTrackingNumber
);

// Détails d'un courrier
router.get(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT,
        roles.COURRIER
    ),
    courrierController.getCourrierById
);

// Modifier un courrier
router.put(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT,
        roles.COURRIER
    ),
    courrierController.updateCourrier
);

// Changer le statut (en transit / arrivé / livré)
router.patch(
    "/:id/status",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT,
        roles.COURRIER
    ),
    courrierController.changeCourrierStatus
);

// Annuler un courrier
router.patch(
    "/:id/cancel",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT,
        roles.COURRIER
    ),
    courrierController.cancelCourrier
);

// Supprimer un courrier
router.delete(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    courrierController.deleteCourrier
);

module.exports = router;
