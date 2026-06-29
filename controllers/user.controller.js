const { User } = require("../models")
const bcrypt = require("bcrypt")
const userService = require("../service/user.service")
const { sendResponse } = require("../utils/message")

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

module.exports = {
    createUser
}