const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const roles = require("../constants/roles");

// Création ticket
router.post(
    "/booking/:booking_id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT
    ),
    ticketController.createTicket
);
// Liste tickets
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
    ticketController.listTickets
);
// Détail ticket
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
    ticketController.getTicketById
);
// Scan QR Code
router.post(
    "/scan",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.CONTROLLER
    ),
    ticketController.scanTicket
);
// Annulation
router.patch(
    "/:id/cancel",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN,
        roles.AGENT
    ),
    ticketController.cancelTicket
);



module.exports = router;