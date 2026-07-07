const { Booking, Trip, Passenger, Ticket, User, sequelize } = require("../models");
const BaseService = require("./base-service");
const bookingStatus = require("../constants/status");
const roles = require("../constants/roles");
const tripStatus = require("../constants/status");

const { Op } = require("sequelize");

class BookingService extends BaseService {

    constructor() {
        super(Booking);
    }
    async create(data, currentUser) {

        const transaction = await sequelize.transaction();

        try {

            let compagny_id;

            if (currentUser.role === roles.SUPER_ADMIN) {

                if (!data.compagny_id) {
                    throw new Error("La compagnie est obligatoire.");
                }

                compagny_id = data.compagny_id;

            } else {

                compagny_id = currentUser.compagny_id;

            }

            const trip = await Trip.findByPk(data.trip_id, {
                transaction
            });

            if (!trip) {
                throw new Error("Voyage introuvable.");
            }

            if (trip.compagny_id !== compagny_id) {
                throw new Error("Voyage invalide.");
            }

            if (
                trip.status === tripStatus.CANCELLED ||
                trip.status === tripStatus.ARRIVED
            ) {
                throw new Error("Impossible de réserver ce voyage.");
            }

            if (new Date(trip.departure_time) <= new Date()) {
                throw new Error("Le voyage est déjà parti.");
            }

            if (trip.available_seats <= 0) {
                throw new Error("Plus aucune place disponible.");
            }


            const passenger = await Passenger.findByPk(
                data.passenger_id,
                {
                    transaction
                }
            );

            if (!passenger) {
                throw new Error("Passager introuvable.");
            }

            if (passenger.compagny_id !== compagny_id) {
                throw new Error("Passager invalide.");
            }

            const seatExist = await Booking.findOne({

                where: {
                    trip_id: trip.id,
                    seat_number: data.seat_number,
                    status: {
                        [Op.ne]: bookingStatus.CANCELLED
                    }
                },

                transaction

            });

            if (seatExist) {
                throw new Error("Ce siège est déjà réservé.");
            }

            const booking_reference =
                "BK" +
                Date.now() +
                Math.floor(Math.random() * 1000);


            const booking = await Booking.create({

                compagny_id,

                trip_id: data.trip_id,

                passenger_id: data.passenger_id,

                seat_number: data.seat_number,

                booking_reference,

                created_by: currentUser.id,

                status:
                    data.status ||
                    bookingStatus.PENDING

            }, {
                transaction
            });

            await trip.update({

                available_seats:
                    trip.available_seats - 1

            }, {
                transaction
            });

            await transaction.commit();

            return await this.getById(
                booking.id,
                currentUser
            );

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
            throw new Error("Impossible de modifier cette réservation.");
        }

        const payload = {};

        if (
            data.seat_number &&
            data.seat_number !== booking.seat_number
        ) {

            const seatExist = await Booking.findOne({

                where: {

                    trip_id: booking.trip_id,

                    seat_number: data.seat_number,

                    status: {
                        [Op.ne]: bookingStatus.CANCELLED
                    },

                    id: {
                        [Op.ne]: id
                    }

                }

            });

            if (seatExist) {
                throw new Error("Ce siège est déjà réservé.");
            }

            payload.seat_number = data.seat_number;

        }

        if (data.status) {
            payload.status = data.status;
        }

        return await super.update(id, payload);

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
    async confirmBooking(id, currentUser) {

        const booking = await this.getById(id, currentUser);

        if (!booking) {
            throw new Error("Réservation introuvable.");
        }

        if (booking.status !== bookingStatus.PENDING) {
            throw new Error("Cette réservation est déjà confirmée.");
        }

        return await super.update(id, {

            status: bookingStatus.CONFIRMED

        });

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