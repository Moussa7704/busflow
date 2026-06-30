/**
 * @swagger
 * tags:
 *   name: Agences
 *   description: Gestion des agences (multi-tenant SaaS)
 */
/**
 * @swagger
 * /api/v1/agences:
 *   post:
 *     summary: Créer une agence
 *     tags: [Agences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - city
 *             properties:
 *               name:
 *                 type: string
 *                 example: Agence Bamako Centre
 *               city:
 *                 type: string
 *                 example: Bamako
 *               address:
 *                 type: string
 *                 example: Quartier ACI 2000
 *               phone:
 *                 type: string
 *                 example: "77000000"
 *               compagny_id:
 *                 type: integer
 *                 description: Seulement SUPER_ADMIN peut le définir
 *                 example: 1
 *     responses:
 *       201:
 *         description: Agence créée
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /api/v1/agences:
 *   get:
 *     summary: Liste des agences
 *     tags: [Agences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: compagny_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des agences
 */

/**
 * @swagger
 * /api/v1/agences/{id}:
 *   put:
 *     summary: Modifier une agence
 *     tags: [Agences]
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
 *             type: object
 *     responses:
 *       200:
 *         description: Agence mise à jour
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Agence introuvable
 */

/**
 * @swagger
 * /api/v1/agences/{id}:
 *   delete:
 *     summary: Supprimer une agence
 *     tags: [Agences]
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
 *         description: Agence supprimée
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Agence introuvable
 */

/**
 * @swagger
 * /api/v1/agences/{id}:
 *   get:
 *     summary: Détail d'une agence
 *     tags: [Agences]
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
 *         description: Détails agence
 *       404:
 *         description: Introuvable
 */

/**
 * @swagger
 * /api/v1/agences/{id}/status:
 *   patch:
 *     summary: Activer / désactiver une agence
 *     tags: [Agences]
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
 *         description: Statut modifié
 *       403:
 *         description: Accès refusé
 * */