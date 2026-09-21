const { Op } = require("sequelize");
const { Ticket, Booking, Trip, Passenger } = require("../models");
const BaseService = require("./base-service");
const QRCode = require("qrcode");
const roles = require("../constants/roles");
const notificationService = require("./notification.service");
const { ticketStatus, tripStatus, bookingStatus } = require("../constants/status");

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
                        {
                            association: "trip",
                            include: [
                                "TripRoute",
                                "compagny"
                            ]
                        },
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

        const qr_code = await QRCode.toDataURL(
            ticket_number
        );

        const ticket = await super.create({
            booking_id,
            compagny_id:
                booking.compagny_id,
            ticket_number,
            qr_code,
            status:
                ticketStatus.ACTIVE
        });

        notificationService.sendBookingConfirmation({
            passenger: booking.passenger,
            trip: booking.trip,
            tickets: [{
                ticket_number: ticket.ticket_number,
                qr_code: ticket.qr_code,
                seat_number: booking.seat_number,
                booking_reference: booking.booking_reference
            }]
        });

        return ticket;
    }
    async getById(id, currentUser) {
        const ticket = await this.model.findByPk(
            id,
            {
                include: [
                    {
                        association: "booking",
                        include: [
                            {
                                association: "trip",
                                include: ["TripRoute"]
                            },
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
                        {
                            association: "trip",
                            include: ["TripRoute"]
                        },
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
                        {
                            association: "trip",
                            include: ["TripRoute"]
                        },
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

        if (!ticket.booking) {
            throw new Error(
                "Réservation introuvable."
            );
        }

        if (ticket.booking.status === bookingStatus.CANCELLED) {
            throw new Error(
                "La Réservation est annulée."
            );
        }

        if (
            ticket.status === ticketStatus.USED ||
            ticket.used
        ) {
            throw new Error(
                "Le ticket est déjà utilisé."
            );
        }

        if (ticket.status !== ticketStatus.ACTIVE) {
            throw new Error(
                "Le ticket est annulé."
            );
        }

        if (
            ticket.booking.trip.status !== tripStatus.SCHEDULED &&
            ticket.booking.trip.status !== tripStatus.BOARDING
        ) {
            throw new Error(
                "Le voyage ne permet pas l'embarquement."
            );
        }

        // const tripDate = new Date(ticket.booking.trip.departure_time);
        // const now = new Date();

        // if (
        //     tripDate.getFullYear() !== now.getFullYear() ||
        //     tripDate.getMonth() !== now.getMonth() ||
        //     tripDate.getDate() !== now.getDate()
        // ) {
        //     throw new Error(
        //         "Le scan doit être effectué le jour du voyage."
        //     );
        // }

        await ticket.update({
            status: ticketStatus.USED,
            used: true,
            scanned_at: new Date()
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