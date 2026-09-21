const dashboardService = require("../service/dashboard.service");
const roles = require("../constants/roles");
const { sendResponse } = require("../utils/message");

const getSummary = async (req, res) => {
    try {

        const filters = {
            days: req.query.days,
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            trip_id: req.query.trip_id
        };

        if (req.user.role !== roles.SUPER_ADMIN) {
            filters.compagny_id = req.user.compagny_id;
        } else if (req.query.compagny_id) {
            filters.compagny_id = req.query.compagny_id;
        }

        const data = await dashboardService.getSummary(filters);

        return sendResponse(res, {
            message: "Résumé du tableau de bord",
            data,
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
    getSummary
};
