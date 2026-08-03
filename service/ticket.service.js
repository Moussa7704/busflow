const { Op } = require("sequelize");
const { Ticket, Booking, Trip, Passenger } = require("../models");
const BaseService = require("./base-service");
const QRCode = require("qrcode");
const roles = require("../constants/roles");
const { ticketStatus } = require("../constants/status");

class TicketService extends BaseService {

    constructor() {
        super(Ticket);
    }

    async create(booking_id, currentUser) {

        const booking =
            await Booking.findByPk(
                booking_id,
                {
                    include: [
                        "trip",
                        "passenger"
                    ]
                }
            );

        if (!booking) {

            throw new Error(
                "Réservation introuvable."
            );

        }

        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            booking.compagny_id !== currentUser.compagny_id
        ) {

            throw new Error(
                "Accès refusé."
            );

        }

        const existTicket = await Ticket.findOne({
            where: {
                booking_id
            }
        });

        if (existTicket) {

            throw new Error(
                "Cette réservation possède déjà un ticket."
            );

        }

        if (
            booking.status !== "CONFIRMED"
        ) {
            throw new Error(
                "La réservation doit être confirmée."
            );
        }

        const ticket_number = "TK-" + Date.now();

        const qrData = {
            ticket_number,
            booking_id,
            passenger:
                booking.passenger.first_name
                + " " +
                booking.passenger.last_name,
            trip_id:
                booking.trip_id
        };

        const qr_code = await QRCode.toDataURL(
            JSON.stringify(qrData)
        );

        return await super.create({
            booking_id,
            compagny_id:
                booking.compagny_id,
            ticket_number,
            qr_code,
            status:
                ticketStatus.ACTIVE
        });
    }
    async getById(id, currentUser) {
        const ticket = await this.model.findByPk(
            id,
            {
                include: [
                    {
                        association: "booking",
                        include: [
                            "trip",
                            "passenger"
                        ]
                    }
                ]
            }
        );

        if (!ticket) {
            return null;
        }


        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            ticket.compagny_id !== currentUser.compagny_id
        ) {

            throw new Error(
                "Accès refusé."
            );

        }


        return ticket;

    }
    async Paginate(page, limit, filters = {}) {

        const where = {};

        if (filters.compagny_id) {

            where.compagny_id =
                filters.compagny_id;

        }

        if (filters.status) {

            where.status =
                filters.status;
        }

        if (filters.ticket_number) {
            where.ticket_number = {
                [Op.iLike]:
                    `%${filters.ticket_number}%`
            };
        }

        return await super.Paginate(page, limit, {
            where,
            include: [
                {
                    association: "booking",
                    include: [
                        "trip",
                        "passenger"
                    ]
                }
            ],
            order: [
                ["createdAt", "DESC"]
            ]
        }
        );
    }
    // ======================================
    // SCAN QR CODE
    // ======================================

    async scanTicket(ticket_number, currentUser) {

        const ticket = await this.model.findOne({
            where: {
                ticket_number
            },
            include: [
                {
                    association: "booking",
                    include: [
                        "trip",
                        "passenger"
                    ]
                }
            ]
        });

        if (!ticket) {
            throw new Error(
                "Ticket introuvable."
            );
        }
        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            ticket.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error(
                "Accès refusé."
            );

        }
        if (
            ticket.status === ticketStatus.USED
        ) {
            throw new Error(
                "Ticket déjà utilisé."
            );
        }
        if (
            ticket.status === ticketStatus.CANCELLED
        ) {
            throw new Error(
                "Ticket annulé."
            );
        }
        await ticket.update({
            status:
                ticketStatus.USED,
            scanned_at:
                new Date()
        });
        return ticket;
    }
    async cancelTicket(id, currentUser) {

        const ticket = await this.getById(id, currentUser)

        if (!ticket) {
            throw new Error(
                "Ticket introuvable."
            );
        }
        if (
            ticket.status === ticketStatus.USED
        ) {
            throw new Error(
                "Impossible d'annuler un ticket utilisé."
            );
        }
        return await super.update(id, {
            status:
                ticketStatus.CANCELLED
        }
        );
    }
}

module.exports =
    new TicketService();