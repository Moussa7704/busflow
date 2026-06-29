const express = require("express")
const router = express.Router()

const userController = require("../controllers/user.controller")

// Gestion des utilisateurs
router.post('/', userController.createUser)

module.exports = router