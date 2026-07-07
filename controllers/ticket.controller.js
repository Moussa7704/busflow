const ticketService = require("../service/ticket.service");
const { sendResponse } = require("../utils/message");

/**
 * Créer un ticket depuis une réservation confirmée
 */
const createTicket = async (req, res) => {

    try {
        const ticket = await ticketService.create(
            req.params.booking_id,
            req.user
        );
        return sendResponse(res, {
            message: "Ticket créé avec succès",
            data: ticket,
            status: 201
        });
    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 400
        });
    }
};

/**
 * Liste des tickets
 */
const listTickets = async (req, res) => {

    try {
        const filters = {
            status: req.query.status,
            ticket_number: req.query.ticket_number
        };
        if (req.user.role !== "SUPER_ADMIN") {
            filters.compagny_id = req.user.compagny_id;
        } else {
            filters.compagny_id = req.query.compagny_id;
        }
        const tickets = await ticketService.Paginate(
            req.query.page || 1,
            req.query.limit || 10,
            filters
        );
        return sendResponse(res, {
            message: "Liste des tickets",
            data: tickets.data,
            pagination: tickets.pagination,
            status: 200
        });
    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });
    }
};
/**
 * Détails ticket
 */
const getTicketById = async (req, res) => {

    try {
        const ticket = await ticketService.getById(
            req.params.id,
            req.user
        );
        if (!ticket) {
            return sendResponse(res, {
                success: false,
                message: "Ticket introuvable",
                status: 404
            });
        }
        return sendResponse(res, {
            message: "Détails du ticket",
            data: ticket,
            status: 200
        });
    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });
    }
};

/**
 * Scanner ticket QR Code
 */
const scanTicket = async (req, res) => {

    try {
        const ticket = await ticketService.scanTicket(
            req.body.ticket_number,
            req.user
        );
        return sendResponse(res, {
            message: "Ticket validé",
            data: ticket,
            status: 200
        });
    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 400
        });
    }
};

/**
 * Annuler ticket
 */
const cancelTicket = async (req, res) => {

    try {
        const ticket = await ticketService.cancelTicket(
            req.params.id,
            req.user
        );
        return sendResponse(res, {
            message: "Ticket annulé",
            data: ticket,
            status: 200
        });
    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 400
        });
    }
};

module.exports = {
    createTicket,
    listTickets,
    getTicketById,
    scanTicket,
    cancelTicket
};