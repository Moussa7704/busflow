const { Booking, Trip, Passenger, Ticket, User, sequelize } = require("../models");
const BaseService = require("./base-service");
const { bookingStatus, paymentMethod, ticketStatus, tripStatus } = require("../constants/status");
const roles = require("../constants/roles");
const { generateBookingReference } = require("../utils/reference");
const notificationService = require("./notification.service");
const QRCode = require("qrcode");

const { Op } = require("sequelize");

class BookingService extends BaseService {

    constructor() {
        super(Booking);
    }
    async create(data, currentUser) {

        const transaction = await sequelize.transaction();

        try {

            const trip = await Trip.findByPk(data.trip_id, {
                include: [
                    { association: "bus" },
                    { association: "TripRoute" },
                    { association: "compagny" }
                ],
                transaction
            });
            if (!trip) {
                throw new Error("Voyage introuvable.");
            }

            if (
                trip.status === tripStatus.DEPARTED ||
                trip.status === tripStatus.ARRIVED ||
                trip.status === tripStatus.CANCELLED
            ) {
                throw new Error(
                    "Impossible de réserver sur ce voyage (déjà parti, arrivé ou annulé)."
                );
            }

            // Vérification compagnie

            if (
                currentUser.role !== roles.SUPER_ADMIN &&
                trip.compagny_id !== currentUser.compagny_id
            ) {
                throw new Error(
                    "Accès refusé."
                );
            }

            const seats = data.seats || 1;

            if (!Number.isInteger(seats) || seats < 1) {
                throw new Error(
                    "Le nombre de places doit être un entier positif."
                );
            }

            if (
                data.payment_methode &&
                !Object.values(paymentMethod).includes(data.payment_methode)
            ) {
                throw new Error("Méthode de paiement invalide.");
            }

            const paidAmount = data.paid_amount !== undefined ? data.paid_amount : trip.price;

            if (isNaN(paidAmount) || paidAmount < 0) {
                throw new Error("Le montant payé est invalide.");
            }

            // Vérifier capacité bus

            const totalBookings =
                await Booking.count({
                    where: {
                        trip_id: data.trip_id,
                        status: {
                            [Op.ne]: bookingStatus.CANCELLED
                        }

                    },
                    transaction
                });

            if (totalBookings + seats > trip.bus.capacity) {
                throw new Error(
                    "Places insuffisantes pour ce voyage."
                );
            }

            // Récupération ou création du passager via son numéro de téléphone

            let passenger = await Passenger.findOne({
                where: {
                    phone: data.phone,
                    compagny_id: trip.compagny_id
                },
                transaction
            });

            if (!passenger) {

                if (!data.first_name || !data.last_name) {
                    throw new Error(
                        "Le nom et le prénom sont obligatoires pour un nouveau passager."
                    );
                }

                passenger = await Passenger.create({
                    compagny_id: trip.compagny_id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    phone: data.phone,
                    email: data.email,
                    identity_number: data.identity_number
                }, { transaction });

            }

            const bookings = [];

            for (let i = 0; i < seats; i++) {

                const booking = await Booking.create({
                    trip_id: data.trip_id,
                    passenger_id: passenger.id,
                    compagny_id: trip.compagny_id,
                    status: bookingStatus.CONFIRMED,
                    booking_reference: generateBookingReference(),
                    seat_number: totalBookings + i + 1,
                    payment_methode: data.payment_methode,
                    paid_amount: paidAmount,
                    created_by: currentUser.id
                }, { transaction });

                booking.passenger = passenger;

                const ticket_number = "TK-" + Date.now() + "-" + booking.id;

                const qr_code = await QRCode.toDataURL(
                    ticket_number
                );

                const ticket = await Ticket.create({
                    booking_id: booking.id,
                    compagny_id: trip.compagny_id,
                    ticket_number,
                    qr_code,
                    status: ticketStatus.ACTIVE
                }, { transaction });

                booking.ticket = ticket;

                bookings.push(booking);

            }

            await trip.update({

                available_seats:
                    trip.available_seats - seats

            }, {
                transaction
            });

            await transaction.commit();

            notificationService.sendBookingConfirmation({
                passenger,
                trip,
                tickets: bookings.map(booking => ({
                    ticket_number: booking.ticket.ticket_number,
                    qr_code: booking.ticket.qr_code,
                    seat_number: booking.seat_number,
                    booking_reference: booking.booking_reference
                }))
            });

            return bookings;

        } catch (error) {

            await transaction.rollback();

            throw error;

        }

    }
    async update(id, data, currentUser) {

        const booking = await this.getById(id, currentUser);

        if (!booking) {
            throw new Error("Réservation introuvable.");
        }

        if (
            booking.status === bookingStatus.CANCELLED ||
            booking.status === bookingStatus.COMPLETED
        ) {
            throw new Error(
                "Impossible de modifier cette réservation."
            );
        }

        const payload = {};

        // Modification du passager si nécessaire
        if (data.passenger_id) {
            payload.passenger_id = data.passenger_id;
        }

        // Modification du voyage si autorisé
        if (data.trip_id) {
            payload.trip_id = data.trip_id;
        }

        if (data.payment_methode) {

            if (!Object.values(paymentMethod).includes(data.payment_methode)) {
                throw new Error("Méthode de paiement invalide.");
            }

            payload.payment_methode = data.payment_methode;

        }

        if (data.paid_amount !== undefined) {

            if (isNaN(data.paid_amount) || data.paid_amount < 0) {
                throw new Error("Le montant payé est invalide.");
            }

            payload.paid_amount = data.paid_amount;

        }

        return await super.update(
            id,
            payload
        );

    }
    async getById(id, currentUser) {

        const booking = await this.model.findByPk(id, {

            include: [

                {
                    association: "trip",
                    include: ["TripRoute"]
                },

                "passenger",

                "ticket"

            ]

        });

        if (!booking) {
            return null;
        }

        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            booking.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }

        return booking;

    }
    async cancelBooking(id, currentUser) {

        const transaction = await sequelize.transaction();

        try {

            const booking = await this.getById(id, currentUser);

            if (!booking) {
                throw new Error("Réservation introuvable.");
            }

            if (booking.status === bookingStatus.CANCELLED) {
                throw new Error("Réservation déjà annulée.");
            }

            if (booking.ticket && booking.ticket.status === ticketStatus.USED) {
                throw new Error(
                    "Impossible d'annuler une réservation dont le ticket a déjà été utilisé."
                );
            }

            const trip = await Trip.findByPk(
                booking.trip_id,
                { transaction }
            );

            await trip.update({

                available_seats:
                    trip.available_seats + 1

            }, {
                transaction
            });

            await booking.update({

                status: bookingStatus.CANCELLED

            }, {
                transaction
            });

            if (booking.ticket && booking.ticket.status !== ticketStatus.CANCELLED) {

                await booking.ticket.update({

                    status: ticketStatus.CANCELLED

                }, {
                    transaction
                });

            }

            await transaction.commit();

            return booking;

        } catch (error) {

            await transaction.rollback();

            throw error;

        }

    }
    async delete(id, currentUser) {

        const booking = await this.getById(id, currentUser);

        if (!booking) {
            throw new Error("Réservation introuvable.");
        }

        const ticket = await Ticket.findOne({

            where: {

                booking_id: id

            }

        });

        if (ticket) {
            throw new Error(
                "Impossible de supprimer une réservation possédant un ticket."
            );
        }

        if (booking.status !== bookingStatus.CANCELLED) {

            const trip = await Trip.findByPk(
                booking.trip_id
            );

            await trip.update({

                available_seats:
                    trip.available_seats + 1

            });

        }

        return await super.delete(id);

    }
    async Paginate(page, limit, filters = {}) {

        const where = {};

        if (filters.compagny_id) {
            where.compagny_id = filters.compagny_id;
        }

        if (filters.trip_id) {
            where.trip_id = filters.trip_id;
        }

        if (filters.passenger_id) {
            where.passenger_id = filters.passenger_id;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.booking_reference) {
            where.booking_reference = {
                [Op.iLike]:
                    `%${filters.booking_reference}%`
            };
        }

        return await super.Paginate(page, limit, {

            where,

            include: [

                {
                    association: "trip",
                    include: ["TripRoute"]
                },

                "passenger",

                "ticket"

            ],

            order: [
                ["createdAt", "DESC"]
            ]

        });

    }

}

module.exports = new BookingService();