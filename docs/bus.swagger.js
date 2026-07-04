 /**
 * @swagger
 * tags:
 *   name: Bus
 *   description: Gestion des buses (multi-tenant SaaS)
 */

 /**
  * @swagger
  * /buses:
  *   post:
  *     summary: Créer un bus
  *     tags: [Bus]
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - plate_number
  *               - bus_number
  *               - capacity
  *               - type
  *             properties:
  *               compagny_id:
  *                 type: integer
  *                 example: 1
  *               plate_number:
  *                 type: string
  *                 example: "ABC-123-ML"
  *               bus_number:
  *                 type: string
  *                 example: "BUS-001"
  *               capacity:
  *                 type: integer
  *                 example: 50
  *               type:
  *                 type: string
  *                 example: "MINIBUS"
  *               status:
  *                 type: string
  *                 enum: [AVAILABLE, MAINTENANCE, OUT_OF_SERVICE]
  *                 example: AVAILABLE
  *     responses:
  *       201:
  *         description: Bus créé avec succès
  *       400:
  *         description: Erreur de validation
  *       403:
  *         description: Accès refusé
  */
  /**
  * @swagger
  * /buses:
  *   get:
  *     summary: Liste des bus
  *     tags: [Bus]
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
  *         example: "Mercedes"
  *       - in: query
  *         name: status
  *         schema:
  *           type: string
  *           enum: [AVAILABLE, MAINTENANCE, OUT_OF_SERVICE]
  *       - in: query
  *         name: type
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: Liste des bus
  */

   /**
  * @swagger
  * /buses/{id}:
  *   get:
  *     summary: Détails d'un bus
  *     tags: [Bus]
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
  *         description: Bus trouvé
  *       404:
  *         description: Bus introuvable
  *       403:
  *         description: Accès refusé
  */

    /**
  * @swagger
  * /buses/{id}:
  *   put:
  *     summary: Modifier un bus
  *     tags: [Bus]
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
  *             properties:
  *               plate_number:
  *                 type: string
  *               bus_number:
  *                 type: string
  *               capacity:
  *                 type: integer
  *               type:
  *                 type: string
  *               status:
  *                 type: string
  *                 enum: [AVAILABLE, MAINTENANCE, OUT_OF_SERVICE]
  *     responses:
  *       200:
  *         description: Bus mis à jour
  *       404:
  *         description: Bus introuvable
  *       403:
  *         description: Accès refusé
  */

     /**
  * @swagger
  * /buses/{id}:
  *   delete:
  *     summary: Supprimer un bus
  *     tags: [Bus]
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
  *         description: Bus supprimé
  *       404:
  *         description: Bus introuvable
  *       403:
  *         description: Accès refusé
  */

      /**
  * @swagger
  * /buses/{id}/status:
  *   patch:
  *     summary: Modifier le statut d'un bus
  *     tags: [Bus]
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
  *               - status
  *             properties:
  *               status:
  *                 type: string
  *                 enum: [AVAILABLE, MAINTENANCE, OUT_OF_SERVICE]
  *                 example: MAINTENANCE
  *     responses:
  *       200:
  *         description: Statut mis à jour
  *       400:
  *         description: Statut invalide
  *       403:
  *         description: Accès refusé
  */