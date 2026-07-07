/**
 * @swagger
 * tags:
 *   name: Passagers
 *   description: Gestion des passagers
 */


/**
 * @swagger
 * /passengers:
 *   post:
 *     summary: Créer un passager
 *     description: Création d'un passager rattaché à une compagnie
 *     tags: [Passagers]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - phone
 *
 *             properties:
 *
 *               compagny_id:
 *                 type: integer
 *                 example: 1
 *                 description: Obligatoire uniquement pour SUPER_ADMIN
 *
 *               first_name:
 *                 type: string
 *                 example: Moussa
 *
 *               last_name:
 *                 type: string
 *                 example: Coulibaly
 *
 *               phone:
 *                 type: string
 *                 example: "77000000"
 *
 *               email:
 *                 type: string
 *                 example: moussa@gmail.com
 *
 *               gender:
 *                 type: string
 *                 example: MALE
 *
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: 1995-05-15
 *
 *     responses:
 *
 *       201:
 *         description: Passager créé avec succès
 *
 *       400:
 *         description: Données invalides
 *
 *       401:
 *         description: Non authentifié
 *
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /passengers:
 *
 *   get:
 *     summary: Liste des passagers
 *     description: Retourne la liste paginée des passagers de la compagnie de l'utilisateur connecté
 *
 *     tags: [Passagers]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Moussa
 *         description: Recherche par nom, téléphone ou email
 *
 *       - in: query
 *         name: compagny_id
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Utilisé uniquement par SUPER_ADMIN
 *
 *
 *     responses:
 *
 *       200:
 *         description: Liste des passagers
 *
 *       401:
 *         description: Non authentifié
 *
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /passengers/{id}:
 *
 *   get:
 *     summary: Obtenir un passager par son ID
 *
 *     tags: [Passagers]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *
 *
 *     responses:
 *
 *       200:
 *         description: Détails du passager
 *
 *       404:
 *         description: Passager introuvable
 *
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /passengers/{id}:
 *
 *   put:
 *
 *     summary: Modifier un passager
 *
 *     tags: [Passagers]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *
 *               first_name:
 *                 type: string
 *                 example: Moussa
 *
 *               last_name:
 *                 type: string
 *                 example: Coulibaly
 *
 *               phone:
 *                 type: string
 *                 example: "76000000"
 *
 *               email:
 *                 type: string
 *                 example: nouveau@email.com
 *
 *               gender:
 *                 type: string
 *                 example: MALE
 *
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: 1996-01-20
 *
 *
 *     responses:
 *
 *       200:
 *         description: Passager modifié avec succès
 *
 *       400:
 *         description: Données invalides
 *
 *       404:
 *         description: Passager introuvable
 *
 *       403:
 *         description: Accès refusé
 */