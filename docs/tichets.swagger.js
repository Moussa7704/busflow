/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Gestion des billets
 */


/**
 * @swagger
 * /tickets/booking/{booking_id}:
 *   post:
 *     summary: Générer un ticket depuis une réservation confirmée
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       201:
 *         description: Ticket créé avec QR Code
 *       400:
 *         description: Erreur métier
 */


/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Liste des tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: ACTIVE
 *       - in: query
 *         name: ticket_number
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des tickets
 */


/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Détails d'un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket trouvé
 */


/**
 * @swagger
 * /tickets/scan:
 *   post:
 *     summary: Scanner un ticket QR Code
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_number:
 *                 type: string
 *                 example: TK-175190542
 *     responses:
 *       200:
 *         description: Ticket validé
 */


/**
 * @swagger
 * /tickets/{id}/cancel:
 *   patch:
 *     summary: Annuler un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket annulé
 */