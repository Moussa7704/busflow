const express = require("express")
const router = express.Router()

const { authenticate, authorize } = require('../middlewares/auth')
const compagnyController = require("../controllers/compagny.controller")

//Compagny
router.post('/create', authenticate, authorize("SUPER_ADMIN"), compagnyController.createCompagny)
router.get('/liste-paginate', compagnyController.listCompagnyPaginate)
router.get('/liste', compagnyController.listCompagny)
router.put('/:id', authenticate, authorize("SUPER_ADMIN"), compagnyController.updateCompagny)
router.delete('/:id', authenticate, authorize("SUPER_ADMIN"), compagnyController.deleteCompagny)





module.exports = router