/**
 * @swagger
 * tags:
 *   name: Courriers
 *   description: Gestion des envois de colis/courriers entre agences
 */

/**
 * @swagger
 * /courriers:
 *   post:
 *     summary: Enregistrer un courrier
 *     tags: [Courriers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender_name
 *               - sender_phone
 *               - receiver_name
 *               - receiver_phone
 *               - departure_agency_id
 *               - arrival_agency_id
 *               - trip_id
 *               - weight
 *               - price
 *             properties:
 *               compagny_id:
 *                 type: integer
 *                 description: Obligatoire uniquement pour SUPER_ADMIN
 *                 example: 1
 *               sender_name:
 *                 type: string
 *                 example: Awa Traoré
 *               sender_phone:
 *                 type: string
 *                 example: "77123456"
 *               receiver_name:
 *                 type: string
 *                 example: Ibrahim Diarra
 *               receiver_phone:
 *                 type: string
 *                 example: "77888888"
 *               description:
 *                 type: string
 *                 example: 2 sacs de riz
 *               quantity:
 *                 type: integer
 *                 default: 1
 *                 example: 2
 *               weight:
 *                 type: number
 *                 description: Poids en kg
 *                 example: 15.5
 *               departure_agency_id:
 *                 type: integer
 *                 example: 1
 *               arrival_agency_id:
 *                 type: integer
 *                 example: 2
 *               trip_id:
 *                 type: integer
 *                 example: 1
 *               price:
 *                 type: number
 *                 example: 3000
 *               paid_amount:
 *                 type: number
 *                 description: Par défaut, le prix est utilisé.
 *                 example: 3000
 *               payment_method:
 *                 type: string
 *                 enum: [CASH, MOBILE_MONEY, CARD]
 *                 example: CASH
 *     responses:
 *       201:
 *         description: Courrier enregistré avec succès
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /courriers:
 *   get:
 *     summary: Liste des courriers
 *     tags: [Courriers]
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
 *         description: Recherche par nom/téléphone de l'expéditeur ou du destinataire
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [REGISTERED, IN_TRANSIT, ARRIVED, DELIVERED, CANCELLED]
 *       - in: query
 *         name: trip_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: departure_agency_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: arrival_agency_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tracking_number
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des courriers
 */

/**
 * @swagger
 * /courriers/tracking/{tracking_number}:
 *   get:
 *     summary: Suivre un courrier par son numéro de tracking
 *     tags: [Courriers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tracking_number
 *         required: true
 *         schema:
 *           type: string
 *           example: CR20260915AB12CD
 *     responses:
 *       200:
 *         description: Détails du courrier
 *       404:
 *         description: Courrier introuvable
 */

/**
 * @swagger
 * /courriers/{id}:
 *   get:
 *     summary: Détails d'un courrier
 *     tags: [Courriers]
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
 *         description: Détails du courrier
 *       404:
 *         description: Courrier introuvable
 */

/**
 * @swagger
 * /courriers/{id}:
 *   put:
 *     summary: Modifier un courrier (uniquement tant qu'il est REGISTERED)
 *     tags: [Courriers]
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
 *               sender_name:
 *                 type: string
 *               sender_phone:
 *                 type: string
 *               receiver_name:
 *                 type: string
 *               receiver_phone:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               weight:
 *                 type: number
 *               price:
 *                 type: number
 *               paid_amount:
 *                 type: number
 *               payment_method:
 *                 type: string
 *                 enum: [CASH, MOBILE_MONEY, CARD]
 *               departure_agency_id:
 *                 type: integer
 *               arrival_agency_id:
 *                 type: integer
 *               trip_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Courrier mis à jour
 *       400:
 *         description: Impossible de modifier
 */

/**
 * @swagger
 * /courriers/{id}/status:
 *   patch:
 *     summary: Changer le statut d'un courrier (REGISTERED → IN_TRANSIT → ARRIVED → DELIVERED)
 *     tags: [Courriers]
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
 *                 enum: [IN_TRANSIT, ARRIVED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Transition non autorisée
 */

/**
 * @swagger
 * /courriers/{id}/cancel:
 *   patch:
 *     summary: Annuler un courrier
 *     tags: [Courriers]
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
 *         description: Courrier annulé
 *       400:
 *         description: Impossible d'annuler
 */

/**
 * @swagger
 * /courriers/{id}:
 *   delete:
 *     summary: Supprimer un courrier (uniquement tant qu'il est REGISTERED)
 *     tags: [Courriers]
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
 *         description: Courrier supprimé
 *       400:
 *         description: Impossible de supprimer
 */
