const { Op } = require("sequelize");
const { Role } = require("../models");
const roles = require("../constants/roles");

const listRoles = async (req, res) => {
    try {

        const where = {};

        switch (req.user.role) {

            case roles.SUPER_ADMIN:
                // voit tout
                break;

            case roles.COMPAGNY_ADMIN:
                where.name = {
                    [Op.in]: [
                        roles.AGENCY_ADMIN,
                        roles.AGENT,
                        roles.CONTROLLER,
                        roles.DRIVER
                    ]
                };
                break;

            case roles.AGENCY_ADMIN:
                where.name = {
                    [Op.in]: [
                        roles.AGENT,
                        roles.CONTROLLER,
                        roles.DRIVER
                    ]
                };
                break;

            default:
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé",
                    status: 403
                });
        }

        const data = await Role.findAll({
            where,
            order: [["id", "ASC"]]
        });

        return sendResponse(res, {
            success: true,
            data,
            message: "Liste des rôles récupérés avec succès"
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
    listRoles
}