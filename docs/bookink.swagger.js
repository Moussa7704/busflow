/**
 * @swagger
 * tags:
 *   name: Réservations
 *   description: Gestion des réservations
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Créer une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trip_id
 *               - passenger_id
 *               - seat_number
 *             properties:
 *               compagny_id:
 *                 type: integer
 *                 example: 1
 *               trip_id:
 *                 type: integer
 *                 example: 1
 *               passenger_id:
 *                 type: integer
 *                 example: 5
 *               seat_number:
 *                 type: string
 *                 example: A05
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - CONFIRMED
 *                   - CANCELLED
 *                   - COMPLETED
 *                 example: PENDING
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Liste des réservations
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par référence
 *       - in: query
 *         name: trip_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: passenger_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: booking_reference
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des réservations
 */

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Détail d'une réservation
 *     tags: [Réservations]
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
 *         description: Réservation trouvée
 *       404:
 *         description: Réservation introuvable
 */

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Modifier une réservation
 *     tags: [Réservations]
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
 *               seat_number:
 *                 type: string
 *                 example: B08
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - CONFIRMED
 *                   - CANCELLED
 *                   - COMPLETED
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 *       400:
 *         description: Erreur de validation
 */

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   patch:
 *     summary: Annuler une réservation
 *     tags: [Réservations]
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
 *         description: Réservation annulée
 *       400:
 *         description: Impossible d'annuler
 */