const { Booking, Trip, Passenger, Ticket, User, sequelize } = require("../models");
const BaseService = require("./base-service");
const bookingStatus = require("../constants/status");
const roles = require("../constants/roles");
const tripStatus = require("../constants/status");
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
                include: [{ association: "bus" }],
                transaction
            });
            if (!trip) {
                throw new Error("Voyage introuvable.");
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

            if (totalBookings >= trip.bus.capacity) {
                throw new Error(
                    "Ce voyage est complet."
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
                    identity_number: data.identity_number
                }, { transaction });

            }

            const booking = await Booking.create({
                trip_id: data.trip_id,
                passenger_id: passenger.id,
                compagny_id: trip.compagny_id,
                status: bookingStatus.CONFIRMED
            }, { transaction });

            await transaction.commit();

            booking.passenger = passenger;

            return booking;

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

        return await super.update(
            id,
            payload
        );

    }
    async getById(id, currentUser) {

        const booking = await this.model.findByPk(id, {

            include: [

                "trip",

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

                "trip",

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