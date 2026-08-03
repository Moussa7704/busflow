const { Op } = require("sequelize");
const BaseService = require("./base-service");
const { Trip, Bus, TripRoute, User, Booking } = require("../models");

const roles = require("../constants/roles");
const { tripStatus } = require("../constants/status");

class TripService extends BaseService {

    constructor() {
        super(Trip);
    }

    async create(data, currentUser) {

        let compagny_id;

        // SUPER ADMIN
        if (currentUser.role === roles.SUPER_ADMIN) {

            if (!data.compagny_id) {
                throw new Error("La compagnie est obligatoire.");
            }

            compagny_id = data.compagny_id;

        } else {

            compagny_id = currentUser.compagny_id;

        }

        // ===========================
        // ROUTE
        // ===========================

        const route = await TripRoute.findByPk(data.route_id);

        if (!route) {
            throw new Error("Route introuvable.");
        }

        if (route.compagny_id !== compagny_id) {
            throw new Error("Cette route n'appartient pas à votre compagnie.");
        }

        // ===========================
        // BUS
        // ===========================

        const bus = await Bus.findByPk(data.bus_id);

        if (!bus) {
            throw new Error("Bus introuvable.");
        }

        if (bus.compagny_id !== compagny_id) {
            throw new Error("Ce bus n'appartient pas à votre compagnie.");
        }

        if (
            bus.status === "MAINTENANCE" ||
            bus.status === "OUT_OF_SERVICE"
        ) {
            throw new Error("Le bus n'est pas disponible.");
        }

        // ===========================
        // DRIVER
        // ===========================

        const driver = await User.findByPk(data.driver_id, {
            include: ["Role"]
        });

        if (!driver) {
            throw new Error("Chauffeur introuvable.");
        }

        if (driver.compagny_id !== compagny_id) {
            throw new Error("Le chauffeur n'appartient pas à cette compagnie.");
        }

        if (driver.Role.name !== roles.DRIVER) {
            throw new Error("L'utilisateur sélectionné n'est pas un chauffeur.");
        }

        // ===========================
        // DATES
        // ===========================

        const departure = new Date(data.departure_time);
        const arrival = new Date(data.arrival_time);

        if (departure >= arrival) {
            throw new Error(
                "La date d'arrivée doit être supérieure à la date de départ."
            );
        }

        // ===========================
        // BUS déjà affecté
        // ===========================

        const existingBusTrip = await Trip.findOne({

            where: {
                bus_id: data.bus_id,
                status: {
                    [Op.notIn]: [
                        tripStatus.CANCELLED,
                        tripStatus.ARRIVED
                    ]
                },
                [Op.or]: [
                    {
                        departure_time: {
                            [Op.between]: [
                                departure,
                                arrival
                            ]
                        }
                    },
                    {
                        arrival_time: {
                            [Op.between]: [
                                departure,
                                arrival
                            ]
                        }
                    }
                ]
            }

        });

        if (existingBusTrip) {
            throw new Error(
                "Ce bus est déjà affecté à un autre voyage."
            );
        }

        // ===========================
        // DRIVER déjà affecté
        // ===========================

        const existingDriverTrip = await Trip.findOne({

            where: {

                driver_id: data.driver_id,

                status: {
                    [Op.notIn]: [
                        tripStatus.CANCELLED,
                        tripStatus.ARRIVED
                    ]
                },

                [Op.or]: [

                    {
                        departure_time: {
                            [Op.between]: [
                                departure,
                                arrival
                            ]
                        }
                    },

                    {
                        arrival_time: {
                            [Op.between]: [
                                departure,
                                arrival
                            ]
                        }
                    }

                ]

            }

        });

        if (existingDriverTrip) {
            throw new Error(
                "Le chauffeur est déjà affecté à un autre voyage."
            );
        }

        // ===========================
        // CREATE
        // ===========================

        const payload = {

            compagny_id,

            route_id: data.route_id,

            bus_id: data.bus_id,

            driver_id: data.driver_id,

            departure_time: departure,

            arrival_time: arrival,

            price: data.price,

            available_seats: bus.capacity,

            status: data.status || tripStatus.SCHEDULED

        };

        return await super.create(payload);

    }
    async getById(id, currentUser) {
        const trip = await this.model.findByPk(id, {
            include: [
                "compagny",
                "TripRoute",
                "bus",
                "Driver"
            ]
        });

        if (!trip) {
            return null;
        }

        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            trip.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }

        return trip;

    }
    async update(id, data, currentUser) {

        const trip = await this.getById(id, currentUser);

        if (!trip) {
            throw new Error("Voyage introuvable.");
        }

        if (
            trip.status === tripStatus.DEPARTED ||
            trip.status === tripStatus.ARRIVED
        ) {
            throw new Error("Impossible de modifier un voyage déjà commencé.");
        }

        const payload = {};

        // =========================
        // ROUTE
        // =========================

        if (data.route_id) {

            const route = await TripRoute.findByPk(data.route_id);

            if (!route) {
                throw new Error("Route introuvable.");
            }

            if (route.compagny_id !== trip.compagny_id) {
                throw new Error("Route invalide.");
            }

            payload.route_id = data.route_id;

        }

        // =========================
        // BUS
        // =========================

        if (data.bus_id) {

            const bus = await Bus.findByPk(data.bus_id);

            if (!bus) {
                throw new Error("Bus introuvable.");
            }

            if (bus.compagny_id !== trip.compagny_id) {
                throw new Error("Bus invalide.");
            }

            if (
                bus.status === "MAINTENANCE" ||
                bus.status === "OUT_OF_SERVICE"
            ) {
                throw new Error("Le bus n'est pas disponible.");
            }
            payload.bus_id = data.bus_id;

        }

        const departure = new Date(
            data.departure_time || trip.departure_time
        );

        const arrival = new Date(
            data.arrival_time || trip.arrival_time
        );

        if (departure >= arrival) {
            throw new Error(
                "La date d'arrivée doit être supérieure à la date de départ."
            );
        }

        const existingBusTrip = await Trip.findOne({
            where: {
                id: {
                    [Op.ne]: id
                },
                bus_id: data.bus_id || trip.bus_id,
                status: {
                    [Op.notIn]: [
                        tripStatus.CANCELLED,
                        tripStatus.ARRIVED
                    ]
                },
                [Op.or]: [
                    {
                        departure_time: {
                            [Op.between]: [departure, arrival]
                        }
                    },
                    {
                        arrival_time: {
                            [Op.between]: [departure, arrival]
                        }
                    }
                ]
            }
        });

        if (existingBusTrip) {
            throw new Error(
                "Ce bus est déjà affecté à un autre voyage."
            );
        }

        // =========================
        // DRIVER
        // =========================

        if (data.driver_id) {

            const driver = await User.findByPk(data.driver_id, {
                include: ["Role"]
            });

            if (!driver) {
                throw new Error("Chauffeur introuvable.");
            }

            if (driver.Role.name !== roles.DRIVER) {
                throw new Error("Utilisateur invalide.");
            }

            if (driver.compagny_id !== trip.compagny_id) {
                throw new Error("Le chauffeur n'appartient pas à cette compagnie.");
            }

            payload.driver_id = data.driver_id;

        }

        if (data.departure_time) {
            payload.departure_time = data.departure_time;
        }

        if (data.arrival_time) {
            payload.arrival_time = data.arrival_time;
        }

        if (data.price) {
            payload.price = data.price;
        }

        return await super.update(id, payload);

    }
    async delete(id, currentUser) {

        const trip = await this.getById(id, currentUser);

        if (!trip) {
            throw new Error("Voyage introuvable.");
        }

        const booking = await Booking.count({
            where: {
                trip_id: id
            }
        });

        if (booking > 0) {
            throw new Error(
                "Impossible de supprimer un voyage possédant des réservations."
            );
        }

        return await super.delete(id);

    }

    async changeStatus(id, status, currentUser) {

        const trip = await this.getById(id, currentUser);

        if (!trip) {
            throw new Error("Voyage introuvable.");
        }

        const transitions = {

            [tripStatus.SCHEDULED]: [
                tripStatus.BOARDING,
                tripStatus.CANCELLED
            ],

            [tripStatus.BOARDING]: [
                tripStatus.DEPARTED
            ],

            [tripStatus.DEPARTED]: [
                tripStatus.ARRIVED
            ],

            [tripStatus.ARRIVED]: [],

            [tripStatus.CANCELLED]: []

        };

        if (!transitions[trip.status].includes(status)) {

            throw new Error(
                "Transition de statut non autorisée."
            );

        }

        return await super.update(id, {
            status
        });

    }

    async cancelTrip(id, currentUser) {

        const trip = await this.getById(id, currentUser);

        if (!trip) {
            throw new Error("Voyage introuvable.");
        }

        if (
            trip.status === tripStatus.ARRIVED ||
            trip.status === tripStatus.DEPARTED
        ) {
            throw new Error(
                "Impossible d'annuler un voyage déjà commencé."
            );
        }

        return await super.update(id, {
            status: tripStatus.CANCELLED
        });

    }

    async Paginate(page = 1, limit = 10, filters = {}) {

        const where = {};


        if (filters.compagny_id) {
            where.compagny_id = filters.compagny_id;
        }


        if (filters.route_id) {
            where.route_id = filters.route_id;
        }

        if (filters.bus_id) {
            where.bus_id = filters.bus_id;
        }

        if (filters.driver_id) {
            where.driver_id = filters.driver_id;
        }

        if (filters.status) {
            where.status = filters.status;
        }


        if (filters.departure_date) {

            const start = new Date(filters.departure_date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(filters.departure_date);
            end.setHours(23, 59, 59, 999);

            where.departure_time = {
                [Op.between]: [start, end]
            };

        }


        if (filters.search) {

            where[Op.or] = [

                {
                    "$TripRoute.departure_city$": {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },

                {
                    "$TripRoute.arrival_city$": {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },

                {
                    "$bus.bus_number$": {
                        [Op.iLike]: `%${filters.search}%`
                    }
                }
            ];
        }

        //---------------------------------

        return await super.Paginate(page, limit, {
            where,
            include: [
                "compagny",
                "TripRoute",
                "bus",
                {
                    association: "Driver",
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                        "phone"
                    ]
                }
            ],
            order: [
                ["departure_time", "ASC"]
            ]
        });

    }
    async getPassengers(tripId, currentUser) {

        const trip = await Trip.findByPk(tripId, {

            include: [
                {
                    association: "bus"
                },
                {
                    association: "TripRoute"
                }
            ]

        });


        if (!trip) {
            throw new Error("Voyage introuvable.");
        }


        // Contrôle SaaS

        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            trip.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }


        const bookings = await Booking.findAll({

            where: {

                trip_id: tripId,

                status: bookingStatus.CONFIRMED

            },

            include: [

                {
                    association: "passenger",
                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                        "phone",
                        "email"
                    ]
                }

            ],

            order: [
                ["seat_number", "ASC"]
            ]

        });


        return {

            trip: {

                id: trip.id,

                departure_time: trip.departure_time,

                arrival_time: trip.arrival_time,

                bus: trip.bus,

                route: trip.TripRoute

            },

            total_passengers: bookings.length,

            passengers: bookings.map(item => ({

                booking_id: item.id,

                seat_number: item.seat_number,

                booking_reference:
                    item.booking_reference,

                passenger:
                    item.passenger

            }))

        };


    }
}

module.exports = new TripService();