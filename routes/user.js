const express = require("express")
const router = express.Router()
const roles = require('../constants/roles')
const userController = require("../controllers/user.controller")
const { authenticate, authorize } = require("../middlewares/auth")

// Gestion des utilisateurs
router.post('/',
    authenticate,
    authorize(roles.SUPER_ADMIN,roles.COMPAGNY_ADMIN),
    userController.createUser
)
router.get('/',
    authenticate,
    authorize(roles.SUPER_ADMIN,roles.COMPAGNY_ADMIN),
    userController.listUsers
)
module.exports = router