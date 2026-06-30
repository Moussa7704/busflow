const { User } = require("../models")
const bcrypt = require("bcrypt")
const userService = require("../service/user.service")
const { sendResponse } = require("../utils/message")
const roles = require('../constants/roles')

const createUser = async (req, res) => {
    try {


        const user = await userService.create(req.body, req.user)


        return sendResponse(res, {
            message: "Utilisateur créé avec succès",
            data: user,
            status: 201
        });
    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 400
        });
    }
}
const listUsers = async (req, res) => {
    try {

        const filters = {
            search: req.query.search,
            role_id: req.query.role_id,
            agency_id: req.query.agency_id,
            is_active: req.query.is_active
        };

        if (req.user.role !== roles.SUPER_ADMIN) {
            filters.compagny_id = req.user.compagny_id;
        } else {
            filters.compagny_id = req.query.compagny_id;
        }

        const users = await userService.Paginate(
            req.query.page || 1,
            req.query.limit || 10,
            filters,
            req.user
        );

        return sendResponse(res, {
            message: "Liste des utilisateurs",
            data: users.data,
            pagination: users.pagination,
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
module.exports = {
    createUser,
    listUsers
}