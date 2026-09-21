const courrierService = require("../service/courrier.service");
const { sendResponse } = require("../utils/message");
const roles = require("../constants/roles");

const createCourrier = async (req, res) => {
    try {

        const courrier = await courrierService.create(req.body, req.user);

        return sendResponse(res, {
            message: "Courrier enregistré avec succès",
            data: courrier,
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

const listCourriers = async (req, res) => {
    try {

        const filters = {
            search: req.query.search,
            trip_id: req.query.trip_id,
            departure_agency_id: req.query.departure_agency_id,
            arrival_agency_id: req.query.arrival_agency_id,
            status: req.query.status,
            tracking_number: req.query.tracking_number
        };

        if (req.user.role !== roles.SUPER_ADMIN) {
            filters.compagny_id = req.user.compagny_id;
        } else {
            filters.compagny_id = req.query.compagny_id;
        }

        const courriers = await courrierService.Paginate(
            req.query.page || 1,
            req.query.limit || 10,
            filters
        );

        return sendResponse(res, {
            message: "Liste des courriers",
            data: courriers.data,
            pagination: courriers.pagination,
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

const getCourrierById = async (req, res) => {
    try {

        const courrier = await courrierService.getById(
            req.params.id,
            req.user
        );

        if (!courrier) {
            return sendResponse(res, {
                success: false,
                message: "Courrier introuvable",
                status: 404
            });
        }

        return sendResponse(res, {
            message: "Détails du courrier",
            data: courrier,
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

const getCourrierByTrackingNumber = async (req, res) => {
    try {

        const courrier = await courrierService.getByTrackingNumber(
            req.params.tracking_number,
            req.user
        );

        if (!courrier) {
            return sendResponse(res, {
                success: false,
                message: "Courrier introuvable",
                status: 404
            });
        }

        return sendResponse(res, {
            message: "Détails du courrier",
            data: courrier,
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

const updateCourrier = async (req, res) => {
    try {

        const courrier = await courrierService.update(
            req.params.id,
            req.body,
            req.user
        );

        return sendResponse(res, {
            message: "Courrier mis à jour",
            data: courrier,
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

const changeCourrierStatus = async (req, res) => {
    try {

        const courrier = await courrierService.changeStatus(
            req.params.id,
            req.body.status,
            req.user,
            { receiver_identity_number: req.body.receiver_identity_number }
        );

        return sendResponse(res, {
            message: "Statut du courrier modifié",
            data: courrier,
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

const cancelCourrier = async (req, res) => {
    try {

        const courrier = await courrierService.cancelCourrier(
            req.params.id,
            req.user
        );

        return sendResponse(res, {
            message: "Courrier annulé",
            data: courrier,
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

const deleteCourrier = async (req, res) => {
    try {

        await courrierService.delete(
            req.params.id,
            req.user
        );

        return sendResponse(res, {
            message: "Courrier supprimé",
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
    createCourrier,
    listCourriers,
    getCourrierById,
    getCourrierByTrackingNumber,
    updateCourrier,
    changeCourrierStatus,
    cancelCourrier,
    deleteCourrier
};
