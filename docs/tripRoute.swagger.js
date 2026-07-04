/**
 * @swagger
 * tags:
 *   name: Routes voyage
 *   description: Gestion des routes de voyage
 */

/**
 * @swagger
 * /trip-routes:
 *   post:
 *     summary: Créer une route de voyage
 *     tags: [Routes voyage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departure_city
 *               - arrival_city
 *               - distance_km
 *               - estimated_duration
 *             properties:
 *               compagny_id:
 *                 type: integer
 *                 example: 1
 *                 description: Requis uniquement pour SUPER_ADMIN
 *               departure_city:
 *                 type: string
 *                 example: Bamako
 *               arrival_city:
 *                 type: string
 *                 example: Ségou
 *               distance_km:
 *                 type: number
 *                 example: 240
 *               estimated_duration:
 *                 type: integer
 *                 example: 180
 *     responses:
 *       201:
 *         description: Route créée avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /trip-routes:
 *   get:
 *     summary: Liste des routes
 *     tags: [Routes voyage]
 *     security:
 *       - bearerAuth: []
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
 *         example: Bamako
 *       - in: query
 *         name: compagny_id
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Utilisable uniquement par SUPER_ADMIN
 *     responses:
 *       200:
 *         description: Liste des routes récupérée avec succès
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /trip-routes/{id}:
 *   get:
 *     summary: Récupérer une route par son ID
 *     tags: [Routes voyage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Route trouvée
 *       404:
 *         description: Route introuvable
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /trip-routes/{id}:
 *   put:
 *     summary: Modifier une route
 *     tags: [Routes voyage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departure_city:
 *                 type: string
 *                 example: Bamako
 *               arrival_city:
 *                 type: string
 *                 example: Sikasso
 *               distance_km:
 *                 type: number
 *                 example: 380
 *               estimated_duration:
 *                 type: integer
 *                 example: 300
 *     responses:
 *       200:
 *         description: Route mise à jour
 *       404:
 *         description: Route introuvable
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /trip-routes/{id}:
 *   delete:
 *     summary: Supprimer une route
 *     tags: [Routes voyage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Route supprimée
 *       404:
 *         description: Route introuvable
 *       403:
 *         description: Accès refusé
 */