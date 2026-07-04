const express = require("express");
const router = express.Router();

const tripRouteController = require("../controllers/tripRoute.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const roles = require("../constants/roles");

// Créer une route
router.post(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    tripRouteController.createTripRoute
);

// Liste des routes
router.get(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN
    ),
    tripRouteController.listTripRoutes
);

// Détail d'une route
router.get(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN
    ),
    tripRouteController.getTripRouteById
);

// Modifier une route
router.put(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    tripRouteController.updateTripRoute
);

// Supprimer une route
router.delete(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    tripRouteController.deleteTripRoute
);

module.exports = router;