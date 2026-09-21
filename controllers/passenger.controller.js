const passengerService = require("../service/passenger.service");
const { sendResponse } = require("../utils/message");
const roles = require("../constants/roles");


const createPassenger = async (req, res) => {

    try {
        const passenger = await passengerService.create(
            req.body,
            req.user
        );
        return sendResponse(res, {
            message: "Passager créé avec succès",
            data: passenger,
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
const listPassengers = async (req, res) => {

    try {
        const filters = {
            search: req.query.search
        };
        if (req.user.role !== roles.SUPER_ADMIN) {
            filters.compagny_id =
                req.user.compagny_id;
        } else {
            filters.compagny_id =
                req.query.compagny_id;
        }

        const passengers =
            await passengerService.Paginate(
                req.query.page || 1,
                req.query.limit || 10,
                filters
            );

        return sendResponse(res, {
            message: "Liste des passagers",
            data: passengers.data,
            pagination: passengers.pagination,
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
const getPassengerById = async (req, res) => {

    try {
        const passenger = await passengerService.getById(
            req.params.id,
            req.user
        );
        if (!passenger) {
            return sendResponse(res, {
                success: false,
                message: "Passager introuvable",
                status: 404
            });
        }
        return sendResponse(res, {
            message: "Détails passager",
            data: passenger,
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
const getPassengerByPhone = async (req, res) => {

    try {
        const passenger = await passengerService.getByPhone(
            req.params.phone,
            req.user,
            req.query.compagny_id
        );
        if (!passenger) {
            return sendResponse(res, {
                success: false,
                message: "Passager introuvable",
                status: 404
            });
        }
        return sendResponse(res, {
            message: "Détails passager",
            data: passenger,
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
const updatePassenger = async (req, res) => {

    try {
        const passenger = await passengerService.update(
            req.params.id,
            req.body,
            req.user
        );
        return sendResponse(res, {
            message: "Passager modifié",
            data: passenger,
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
    createPassenger,
    listPassengers,
    getPassengerById,
    getPassengerByPhone,
    updatePassenger
}