const { sendResponse } = require("../utils/message")
const tripService = require("../service/trip.service");
const roles = require("../constants/roles")

const createTrip = async (req, res) => {
    try {
        const trip = await tripService.createTrip(req.body, req.user);
        sendResponse({
            message: "Voyage créé avec succès",
            data: trip,
            status: 201
        });
    } catch (error) {
        sendResponse({
            success: false,
            message: error.message,
            status: 400
        });
    }
};

const listTrips = async (req, res) => {
    try {

        const filters = {
            search: req.query.search,
            route_id: req.query.route_id,
            bus_id: req.query.bus_id,
            driver_id: req.query.driver_id,
            status: req.query.status,
            departure_date: req.query.departure_date
        };

        if (req.user.role !== roles.SUPER_ADMIN) {
            filters.compagny_id = req.user.compagny_id;
        } else {
            filters.compagny_id = req.query.compagny_id;
        }

        const trips = await tripService.Paginate(
            req.query.page || 1,
            req.query.limit || 10,
            filters
        );

        return sendResponse(res, {
            message: "Liste des voyages",
            data: trips.data,
            pagination: trips.pagination,
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

const getTripById = async (req, res) => {
    try {

        const trip = await tripService.getById(
            req.params.id,
            req.user
        );

        if (!trip) {
            return sendResponse(res, {
                success: false,
                message: "Voyage introuvable",
                status: 404
            });
        }

        return sendResponse(res, {
            message: "Détails du voyage",
            data: trip,
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

const updateTrip = async (req, res) => {
    try {

        const trip = await tripService.update(
            req.params.id,
            req.body,
            req.user
        );

        return sendResponse(res, {
            message: "Voyage mis à jour",
            data: trip,
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

const deleteTrip = async (req, res) => {
    try {

        await tripService.delete(
            req.params.id,
            req.user
        );

        return sendResponse(res, {
            message: "Voyage supprimé",
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

const changeTripStatus = async (req, res) => {
    try {

        const trip = await tripService.changeStatus(
            req.params.id,
            req.body.status,
            req.user
        );

        return sendResponse(res, {
            message: "Statut du voyage modifié",
            data: trip,
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

const cancelTrip = async (req, res) => {
    try {

        const trip = await tripService.cancelTrip(
            req.params.id,
            req.user
        );

        return sendResponse(res, {
            message: "Voyage annulé",
            data: trip,
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
    createTrip,
    listTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    changeTripStatus,
    cancelTrip
}