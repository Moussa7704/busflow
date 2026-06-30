/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - role_id
 *             properties:
 *               compagny_id:
 *                 type: integer
 *                 example: 1
 *               agency_id:
 *                 type: integer
 *                 example: 1
 *               role_id:
 *                 type: integer
 *                 example: 2
 *               first_name:
 *                 type: string
 *                 example: Moussa
 *               last_name:
 *                 type: string
 *                 example: Coulibaly
 *               phone:
 *                 type: string
 *                 example: "77000000"
 *               email:
 *                 type: string
 *                 example: moussa@email.com
 *               password:
 *                 type: string
 *                 example: Password123@
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Liste des utilisateurs
 *     tags: [Users]
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
 *         name: role_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: agency_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: compagny_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Détail d'un utilisateur
 *     tags: [Users]
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
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur introuvable
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
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
 *         description: Utilisateur modifié
 *       404:
 *         description: Utilisateur introuvable
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
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
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur introuvable
 */

/**
 * @swagger
 * /api/v1/users/{id}/status:
 *   patch:
 *     summary: Activer ou désactiver un utilisateur
 *     tags: [Users]
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
 */

/**
 * @swagger
 * /api/v1/users/{id}/change-password:
 *   put:
 *     summary: Réinitialiser le mot de passe d'un utilisateur
 *     description: Accessible uniquement au SUPER_ADMIN et COMPAGNY_ADMIN.
 *     tags: [Users]
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
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: NewPassword123@
 *     responses:
 *       200:
 *         description: Mot de passe modifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur introuvable
 */