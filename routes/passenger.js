const express = require("express");
const router = express.Router();

const passengerController = require("../controllers/passenger.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const roles = require("../constants/roles");

// Créer un passager
router.post(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT
    ),
    passengerController.createPassenger
);

// Liste des passagers
router.get(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT,
        roles.CONTROLLER
    ),
    passengerController.listPassengers
);

// Récupérer un passager par son numéro de téléphone
router.get(
    "/phone/:phone",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT,
        roles.CONTROLLER
    ),
    passengerController.getPassengerByPhone
);

// Détails d'un passager
router.get(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT,
        roles.CONTROLLER
    ),
    passengerController.getPassengerById
);

// Modifier un passager
router.put(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT
    ),
    passengerController.updatePassenger
);

module.exports = router;