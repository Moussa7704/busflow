const bookingService = require("../service/booking.service");
const { sendResponse } = require("../utils/message");
const roles = require("../constants/roles");

const createBooking = async (req, res) => {
    try {

        const booking = await bookingService.create(req.body, req.user);

        return sendResponse(res, {
            message: "Réservation créée avec succès",
            data: booking,
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

const listBookings = async (req, res) => {
    try {

        const filters = {
            search: req.query.search,
            trip_id: req.query.trip_id,
            passenger_id: req.query.passenger_id,
            status: req.query.status,
            booking_reference: req.query.booking_reference
        };

        if (req.user.role !== roles.SUPER_ADMIN) {
            filters.compagny_id = req.user.compagny_id;
        } else {
            filters.compagny_id = req.query.compagny_id;
        }

        const bookings = await bookingService.Paginate(
            req.query.page || 1,
            req.query.limit || 10,
            filters
        );

        return sendResponse(res, {
            message: "Liste des réservations",
            data: bookings.data,
            pagination: bookings.pagination,
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

const getBookingById = async (req, res) => {
    try {

        const booking = await bookingService.getById(
            req.params.id,
            req.user
        );

        if (!booking) {

            return sendResponse(res, {
                success: false,
                message: "Réservation introuvable",
                status: 404
            });

        }

        return sendResponse(res, {
            message: "Détails de la réservation",
            data: booking,
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

const updateBooking = async (req, res) => {
    try {

        const booking = await bookingService.update(
            req.params.id,
            req.body,
            req.user
        );

        return sendResponse(res, {
            message: "Réservation mise à jour",
            data: booking,
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

const cancelBooking = async (req, res) => {
    try {

        const booking = await bookingService.cancelBooking(
            req.params.id,
            req.user
        );

        return sendResponse(res, {
            message: "Réservation annulée",
            data: booking,
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

const deleteBooking = async (req, res) => {
    try {

        await bookingService.delete(
            req.params.id,
            req.user
        );

        return sendResponse(res, {
            message: "Réservation supprimée",
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
    createBooking,
    listBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    deleteBooking
};