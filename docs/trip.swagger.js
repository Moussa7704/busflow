 
 /**
 * @swagger
 * tags:
 *   name: Voyages
 *   description: Gestion des voyages
 */

 /**
 * @swagger
 * /trips:
 *   post:
 *     summary: Créer un voyage
 *     tags: [Voyages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - route_id
 *               - bus_id
 *               - driver_id
 *               - departure_time
 *               - arrival_time
 *               - price
 *             properties:
 *               compagny_id:
 *                 type: integer
 *                 example: 1
 *               route_id:
 *                 type: integer
 *                 example: 1
 *               bus_id:
 *                 type: integer
 *                 example: 2
 *               driver_id:
 *                 type: integer
 *                 example: 5
 *               departure_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-07-10T08:00:00Z"
 *               arrival_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-07-10T12:00:00Z"
 *               price:
 *                 type: number
 *                 example: 5000
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, BOARDING, DEPARTED, ARRIVED, CANCELLED]
 *                 example: SCHEDULED
 *     responses:
 *       201:
 *         description: Voyage créé avec succès
 *       400:
 *         description: Erreur de validation
 */

/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Liste des voyages
 *     tags: [Voyages]
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
 *       - in: query
 *         name: route_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: bus_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: driver_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des voyages
 */

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Détails d’un voyage
 *     tags: [Voyages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Détails du voyage
 *       404:
 *         description: Voyage introuvable
 */

/**
 * @swagger
 * /trips/{id}:
 *   put:
 *     summary: Modifier un voyage
 *     tags: [Voyages]
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
 *               route_id:
 *                 type: integer
 *               bus_id:
 *                 type: integer
 *               driver_id:
 *                 type: integer
 *               departure_time:
 *                 type: string
 *                 format: date-time
 *               arrival_time:
 *                 type: string
 *                 format: date-time
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Voyage mis à jour
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Voyage introuvable
 */

/**
 * @swagger
 * /trips/{id}:
 *   delete:
 *     summary: Supprimer un voyage
 *     tags: [Voyages]
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
 *         description: Voyage supprimé
 *       400:
 *         description: Impossible de supprimer
 */

/**
 * @swagger
 * /trips/{id}/status:
 *   patch:
 *     summary: Modifier le statut d’un voyage
 *     tags: [Voyages]
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
 *                 enum: [SCHEDULED, BOARDING, DEPARTED, ARRIVED, CANCELLED]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Transition non autorisée
 */

/**
 * @swagger
 * /trips/{id}/cancel:
 *   patch:
 *     summary: Annuler un voyage
 *     tags: [Voyages]
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
 *         description: Voyage annulé
 *       400:
 *         description: Impossible d’annuler
 */

/**
 * @swagger
 * /trips/{id}/passengers:
 *   get:
 *     summary: Liste des passagers confirmés d'un voyage
 *     description: |
 *       Retourne la liste des passagers ayant une réservation confirmée pour un voyage donné.
 *       Utilisé pour la feuille d'embarquement, le contrôle chauffeur et l'impression de la liste voyageurs.
 *     tags:
 *       - Voyages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du voyage
 *         schema:
 *           type: integer
 *         example: 25
 *
 *     responses:
 *
 *       200:
 *         description: Liste des passagers récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Liste des passagers du voyage
 *
 *                 data:
 *                   type: object
 *
 *                   properties:
 *
 *                     trip:
 *                       type: object
 *                       properties:
 *
 *                         id:
 *                           type: integer
 *                           example: 25
 *
 *                         departure_time:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-07-08T08:00:00Z"
 *
 *                         arrival_time:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-07-08T15:00:00Z"
 *
 *                         bus:
 *                           type: object
 *                           properties:
 *
 *                             id:
 *                               type: integer
 *                               example: 10
 *
 *                             plate_number:
 *                               type: string
 *                               example: "AB-1234-MD"
 *
 *                             bus_number:
 *                               type: string
 *                               example: "BUS-01"
 *
 *                         route:
 *                           type: object
 *                           properties:
 *
 *                             departure_city:
 *                               type: string
 *                               example: Bamako
 *
 *                             arrival_city:
 *                               type: string
 *                               example: Sikasso
 *
 *
 *                     total_passengers:
 *                       type: integer
 *                       example: 45
 *
 *
 *                     passengers:
 *                       type: array
 *
 *                       items:
 *                         type: object
 *
 *                         properties:
 *
 *                           booking_id:
 *                             type: integer
 *                             example: 100
 *
 *                           booking_reference:
 *                             type: string
 *                             example: BK202607080001
 *
 *                           passenger:
 *                             type: object
 *
 *                             properties:
 *
 *                               id:
 *                                 type: integer
 *                                 example: 15
 *
 *                               first_name:
 *                                 type: string
 *                                 example: Moussa
 *
 *                               last_name:
 *                                 type: string
 *                                 example: Coulibaly
 *
 *                               phone:
 *                                 type: string
 *                                 example: "77000000"
 *
 *                               email:
 *                                 type: string
 *                                 example: moussa@email.com
 *
 *
 *       401:
 *         description: Token manquant ou invalide
 *
 *       403:
 *         description: Accès refusé
 *
 *       404:
 *         description: Voyage introuvable
 *
 *       500:
 *         description: Erreur serveur
 */