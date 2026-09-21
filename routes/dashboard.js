const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const roles = require("../constants/roles");

router.get(
    "/summary",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN
    ),
    dashboardController.getSummary
);

module.exports = router;
