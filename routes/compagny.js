const express = require("express")
const router = express.Router()

const compagnyController = require("../controllers/compagny.controller")

//Compagny
router.post('/create', compagnyController.createCompagny)
router.get('/liste-paginate', compagnyController.getCompanies)
router.get('/liste', compagnyController.getAllCompanies)





module.exports = router