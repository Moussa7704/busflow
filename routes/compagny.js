const express = require("express");
const router = express.Router();
const roles = require('../constants/roles')
const { authenticate, authorize } = require("../middlewares/auth");
const compagnyController = require("../controllers/compagny.controller");

// Companies
router.post("/",authenticate,authorize(roles.SUPER_ADMIN),compagnyController.createCompagny)
router.get("/", compagnyController.listCompagny);
router.get("/:id", compagnyController.getCompagnyById);
router.put("/:id",authenticate,authorize(roles.SUPER_ADMIN),compagnyController.updateCompagny);
router.delete("/:id",authenticate,authorize(roles.SUPER_ADMIN),compagnyController.deleteCompagny);

module.exports = router;