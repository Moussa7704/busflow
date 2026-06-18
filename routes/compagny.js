const express = require("express")
const router = express.Router()

const { authenticate, authorize } = require('../middlewares/auth')
const compagnyController = require("../controllers/compagny.controller")

//Compagny
router.post('/compagnies', compagnyController.createCompagny)
router.get('/compagnies', compagnyController.listCompagny)
router.get('/compagnies/paginate', compagnyController.listCompagnyPaginate)
router.put('/:id', compagnyController.updateCompagny)
router.delete('/:id', compagnyController.deleteCompagny)

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Gestion des compagnies de transport
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Créer une compagnie
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bani Transport"
 *               email:
 *                 type: string
 *                 example: "contact@bani.com"
 *               phone:
 *                 type: string
 *                 example: "70000000"
 *               address:
 *                 type: string
 *                 example: "Bamako"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Compagnie créée avec succès
 *       400:
 *         description: Erreur de validation
 */

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Lister toutes les compagnies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Liste des compagnies
 */
/**
 * @swagger
 * /companies/paginate:
 *   get:
 *     summary: Liste paginée des compagnies
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginée des compagnies
 */
/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Modifier une compagnie
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Compagnie mise à jour
 *       404:
 *         description: Compagnie introuvable
 */
/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Supprimer une compagnie
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compagnie supprimée
 *       404:
 *         description: Compagnie introuvable
 */
module.exports = router