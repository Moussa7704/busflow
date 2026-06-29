const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middlewares/auth");
const compagnyController = require("../controllers/compagny.controller");

// Companies
router.post("/",authenticate,authorize("SUPER_ADMIN"),compagnyController.createCompagny)
router.get("/", compagnyController.listCompagny);
router.get("/:id", compagnyController.getCompagnyById);
router.put("/:id",authenticate,authorize("SUPER_ADMIN"),compagnyController.updateCompagny);
router.delete("/:id",authenticate,authorize("SUPER_ADMIN"),compagnyController.deleteCompagny);

/**
 * @swagger
 * tags:
 *   - name: Companies
 *     description: Gestion des compagnies de transport
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Créer une compagnie
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompany'
 *     responses:
 *       201:
 *         description: Compagnie créée avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
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
  *   get:
  *     summary: Récupérer une compagnie par ID
  *     tags: [Companies]
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: ID de la compagnie
  *     responses:
  *       200:
  *         description: Compagnie récupérée avec succès
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 success:
  *                   type: boolean
  *                   example: true
  *                 message:
  *                   type: string
  *                   example: Compagnie récupérée
  *                 data:
  *                   $ref: '#/components/schemas/Company'
  *       404:
  *         description: Compagnie introuvable
  *       401:
  *         description: Non authentifié
  *       403:
  *         description: Accès refusé
  *       500:
  *         description: Erreur serveur
  */
 
/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Modifier une compagnie
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/CreateCompany'
 *     responses:
 *       200:
 *         description: Compagnie mise à jour avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Compagnie introuvable
 */

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Supprimer une compagnie
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compagnie supprimée avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Compagnie introuvable
 */

module.exports = router;