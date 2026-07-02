const { Bus } = require("../models")
const busService = require("../service/bus.service")
const { sendResponse } = require("../utils/message")

const createBus = async (req, res) => {
    try {

        const bus = await busService.create(req.body, req.user);

        return sendResponse(res, {
            message: "Bus créé avec succès",
            data: bus,
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
const updateBus = async (req, res) => {
    try {

        const bus = await busService.update(
            req.params.id,
            req.body,
            req.user
        );

        if (!bus) {
            return sendResponse(res, {
                success: false,
                message: "Bus introuvable",
                status: 404
            });
        }

        return sendResponse(res, {
            message: "Bus mis à jour avec succès",
            data: bus,
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
const deleteBus = async (req, res) => {
    try {

        await busService.delete(
            req.params.id,
            req.user
        );

        return sendResponse(res, {
            message: "Bus supprimé avec succès",
            status: 200
        });

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: error.message === "Accès refusé." ? 403 : 400
        });

    }
}
const listBus = async (req, res) => {
    try {

        const filters = {
            search: req.query.search,
            status: req.query.status,
            type: req.query.type,
            capacity: req.query.capacity
        };

        if (req.user.role !== roles.SUPER_ADMIN) {
            filters.compagny_id = req.user.compagny_id;
        } else {
            filters.compagny_id = req.query.compagny_id;
        }

        const buses = await busService.Paginate(
            req.query.page || 1,
            req.query.limit || 10,
            filters
        );

        return sendResponse(res, {
            message: "Liste des bus",
            data: buses.data,
            pagination: buses.pagination,
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
const getBusById = async (req, res) => {
    try {

        const bus = await busService.getById(
            req.params.id,
            req.user
        );

        if (!bus) {
            return sendResponse(res, {
                success: false,
                message: "Bus introuvable",
                status: 404
            });
        }

        return sendResponse(res, {
            message: "Bus récupéré avec succès",
            data: bus,
            status: 200
        });

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: error.message === "Accès refusé." ? 403 : 500
        });

    }
};
const changeBusStatus = async (req, res) => {
    try {

        const bus = await busService.changeStatus(
            req.params.id,
            req.body.status,
            req.user
        );

        if (!bus) {
            return sendResponse(res, {
                success: false,
                message: "Bus introuvable",
                status: 404
            });
        }

        return sendResponse(res, {
            message: "Statut du bus mis à jour avec succès",
            data: bus,
            status: 200
        });

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: error.message === "Accès refusé." ? 403 : 400
        });

    }
};
module.exports = {
    createBus,
    updateBus,
    deleteBus,
    listBus,
    getBusById,
    changeBusStatus
}  