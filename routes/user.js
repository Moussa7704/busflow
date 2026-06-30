const express = require("express")
const router = express.Router()

const userController = require("../controllers/user.controller")
const { authenticate, authorize } = require("../middlewares/auth")

// Gestion des utilisateurs
router.post('/',
    authenticate,
    authorize('SUPER_ADMIN', 'COMPAGNY_ADMIN'),
    userController.createUser
)

module.exports = router