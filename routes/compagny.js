const express = require("express")
const router = express.Router()

const compagnyController = require("../controllers/compagny.controller")

//Compagny
router.post('/create', compagnyController.create)
router.get('/liste-paginate', compagnyController.getCompanies)
router.get('/liste', compagnyController.get)
router.put('/:id', compagnyController.update)
router.delete('/:id', compagnyController.deleteCompagny)





module.exports = router