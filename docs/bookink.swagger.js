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
 *               - phone
 *             properties:
 *               trip_id:
 *                 type: integer
 *                 example: 1
 *               phone:
 *                 type: string
 *                 description: Numéro du passager. S'il existe déjà pour la compagnie, ses infos sont réutilisées, sinon un nouveau passager est créé avec first_name/last_name.
 *                 example: 77123456
 *               first_name:
 *                 type: string
 *                 description: Obligatoire uniquement si le passager n'existe pas encore
 *                 example: Awa
 *               last_name:
 *                 type: string
 *                 description: Obligatoire uniquement si le passager n'existe pas encore
 *                 example: Traoré
 *               identity_number:
 *                 type: string
 *                 example: ML123456
 *               email:
 *                 type: string
 *                 description: Obligatoire uniquement si le passager n'existe pas encore. Utilisée pour envoyer le billet/QR code par email après confirmation.
 *                 example: awa.traore@email.com
 *               seats:
 *                 type: integer
 *                 description: Nombre de places à réserver sous ce même passager (voyage en groupe). Chaque place génère sa propre réservation et son propre billet.
 *                 default: 1
 *                 example: 3
 *               payment_methode:
 *                 type: string
 *                 description: Méthode de paiement utilisée pour la réservation
 *                 enum:
 *                   - CASH
 *                   - MOBILE_MONEY
 *                   - CARD
 *                 example: MOBILE_MONEY
 *               paid_amount:
 *                 type: number
 *                 description: Montant payé pour la réservation. Par défaut, le prix du voyage est utilisé.
 *                 example: 5000
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