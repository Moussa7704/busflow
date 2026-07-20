const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const roles = require("../constants/roles");

// Créer une réservation
router.post(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT
    ),
    bookingController.createBooking
);

// Liste des réservations
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
    bookingController.listBookings
);

// Détails d'une réservation
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
    bookingController.getBookingById
);

// Modifier une réservation
router.put(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT
    ),
    bookingController.updateBooking
);

// Annuler une réservation
router.patch(
    "/:id/cancel",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT
    ),
    bookingController.cancelBooking
);

module.exports = router;