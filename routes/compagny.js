const express = require("express")
const router = express.Router()

const { authenticate, authorize } = require('../middlewares/auth')
const compagnyController = require("../controllers/compagny.controller")

//Compagny
router.post('/create', authenticate, authorize("SUPER_ADMIN"), compagnyController.create)
router.get('/liste-paginate', compagnyController.getCompanies)
router.get('/liste', compagnyController.get)
router.put('/:id', authenticate, authorize("SUPER_ADMIN"), compagnyController.update)
router.delete('/:id', authenticate, authorize("SUPER_ADMIN"), compagnyController.deleteCompagny)





module.exports = router