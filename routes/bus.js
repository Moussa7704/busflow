const express = require('express');
const router = express.Router();
const roles = require('../constants/roles')

const busController = require("../controllers/bus.controller");

const {
    authenticate,
    authorize
} = require('../middlewares/auth');

router.post(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    busController.createBus
);

router.get(
    "/",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN
    ),
    busController.listBus
);

router.get(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN
    ),
    busController.getBusById
);

router.put(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    busController.updateBus
);

router.delete(
    "/:id",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN
    ),
    busController.deleteBus
);

router.patch(
    "/:id/status",
    authenticate,
    authorize(
        roles.SUPER_ADMIN,
        roles.COMPAGNY_ADMIN,
        roles.AGENCY_ADMIN
    ),
    busController.changeBusStatus
);

module.exports = router