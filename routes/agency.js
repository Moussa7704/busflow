const express = require('express');
const router = express.Router();

const agencyController = require("../controllers/agency.controller");

const {
    authenticate,
    authorize
} = require('../middlewares/auth');

router.post(
    '/',
    authenticate,
    authorize('SUPER_ADMIN', 'COMPANY_ADMIN'),
    agencyController.createAgency
);

router.get(
    '/',
    authenticate,
    agencyController.listAgency
);

router.put(
    '/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'COMPANY_ADMIN'),
    agencyController.updateAgency
);

router.delete(
    '/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'COMPANY_ADMIN'),
    agencyController.deleteAgency
);

module.exports = router;