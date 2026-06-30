const express = require('express');
const router = express.Router();
const roles = require('../constants/roles')

const agencyController = require("../controllers/agency.controller");

const {
    authenticate,
    authorize
} = require('../middlewares/auth');

router.post(
    '/',
    authenticate,
    authorize(roles.SUPER_ADMIN, roles.COMPAGNY_ADMIN),
    agencyController.createAgency
);

router.get(
    '/',
    authenticate,
    authorize(roles.SUPER_ADMIN, roles.COMPAGNY_ADMIN),
    agencyController.listAgency
);

router.put(
    '/:id',
    authenticate,
    authorize(roles.SUPER_ADMIN, roles.COMPAGNY_ADMIN),
    agencyController.updateAgency
);

router.delete(
    '/:id',
    authenticate,
    authorize(roles.SUPER_ADMIN, roles.COMPAGNY_ADMIN),
    agencyController.deleteAgency
);

module.exports = router;