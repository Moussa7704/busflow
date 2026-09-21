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
 *     tags:
 *       - Compagnies
 *     security:
 *       - bearerAuth: []
 *     description: Seul le SUPER_ADMIN peut créer une compagnie.
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
 *                 example: BusFlow Mali
 *               email:
 *                 type: string
 *                 example: contact@busflow.ml
 *               telephone:
 *                 type: string
 *                 example: "+22370000000"
 *               adresse:
 *                 type: string
 *                 example: Bamako
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Compagnie créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /compagnies:
 *   get:
 *     summary: Liste des compagnies
 *     tags:
 *       - Compagnies
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: bus
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         example: true
 *     responses:
 *       200:
 *         description: Liste des compagnies
 */

/**
 * @swagger
 * /compagnies/{id}:
 *   get:
 *     summary: Récupérer une compagnie
 *     tags:
 *       - Compagnies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compagnie récupérée
 *       404:
 *         description: Compagnie introuvable
 */

/**
 * @swagger
 * /compagnies/{id}:
 *   put:
 *     summary: Modifier une compagnie
 *     tags:
 *       - Compagnies
 *     security:
 *       - bearerAuth: []
 *     description: Seul le SUPER_ADMIN peut modifier une compagnie.
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
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Compagnie mise à jour
 *       404:
 *         description: Compagnie introuvable
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
 *             $ref: '#/components/schemas/CreateCompagnies'
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
 *     tags:
 *       - Compagnies
 *     security:
 *       - bearerAuth: []
 *     description: Seul le SUPER_ADMIN peut supprimer une compagnie.
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