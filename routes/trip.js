const express = require("express");
const router = express.Router();

const tripController = require("../controllers/trip.controller");
const roles = require("../constants/roles");

const {
    authenticate,
    authorize
} = require("../middlewares/auth");


// Création
router.post(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    tripController.createTrip
);

// Liste
router.get(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN
    ),
    tripController.listTrips
);

// Détail
router.get(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN
    ),
    tripController.getTripById
);

// Modification
router.put(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    tripController.updateTrip
);

// Suppression
router.delete(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    tripController.deleteTrip
);

// Changement de statut
router.patch(
    "/:id/status",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    tripController.changeTripStatus
);

// Annulation
router.patch(
    "/:id/cancel",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    tripController.cancelTrip
);

// Liste des passagers d'un voyage
router.get(
    "/:id/passengers",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.CONTROLLER
    ),
    tripController.getTripPassengers
);
module.exports = router;