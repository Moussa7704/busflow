const tripRouteService = require("../service/tripRoute");
const { sendResponse } = require("../utils/message");

const createTripRoute = async (req, res) => {
    try {

        const route = await tripRouteService.create(req.body, req.user);

        return sendResponse(res, {
            message: "Route créée avec succès",
            data: route,
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

const listTripRoutes = async (req, res) => {
    try {

        const routes = await tripRouteService.Paginate(
            req.query.page || 1,
            req.query.limit || 10,
            {
                compagny_id: req.query.compagny_id,
                search: req.query.search
            },
            req.user
        );

        return sendResponse(res, {
            message: "Liste des routes",
            data: routes.data,
            pagination: routes.pagination
        });

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });

    }
};

const getTripRouteById = async (req, res) => {

    try {

        const route = await tripRouteService.getById(
            req.params.id,
            req.user
        );

        if (!route) {

            return sendResponse(res, {
                success: false,
                message: "Route introuvable",
                status: 404
            });

        }

        return sendResponse(res, {
            message: "Route récupérée",
            data: route
        });

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });

    }
};

const updateTripRoute = async (req, res) => {

    try {

        const route = await tripRouteService.update(
            req.params.id,
            req.body,
            req.user
        );

        if (!route) {

            return sendResponse(res, {
                success: false,
                message: "Route introuvable",
                status: 404
            });

        }

        return sendResponse(res, {
            message: "Route mise à jour",
            data: route
        });

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });

    }
};

const deleteTripRoute = async (req, res) => {

    try {

        const deleted = await tripRouteService.delete(
            req.params.id,
            req.user
        );

        if (!deleted) {

            return sendResponse(res, {
                success: false,
                message: "Route introuvable",
                status: 404
            });

        }

        return sendResponse(res, {
            message: "Route supprimée"
        });

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });

    }
};

module.exports = {
    createTripRoute,
    listTripRoutes,
    getTripRouteById,
    updateTripRoute,
    deleteTripRoute
};