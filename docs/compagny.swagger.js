/**
 * @swagger
 * tags:
 *   - name: Compagnies
 *     description: Gestion des compagnies de transport
 */

/**
 * @swagger
 * /compagnies:
 *   post:
 *     summary: Créer une compagnie
 *     tags: [Compagnies]
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
 * /compagnies:
 *   get:
 *     summary: Lister toutes les compagnies
 *     tags: [Compagnies]
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
 * /compagnies/paginate:
 *   get:
 *     summary: Liste paginée des compagnies
 *     tags: [Compagnies]
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
  * /compagnies/{id}:
  *   get:
  *     summary: Récupérer une compagnie par ID
  *     tags: [Compagnies]
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
 * /compagnies/{id}:
 *   put:
 *     summary: Modifier une compagnie
 *     tags: [Compagnies]
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
 * /compagnies/{id}:
 *   delete:
 *     summary: Supprimer une compagnie
 *     tags: [Compagnies]
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