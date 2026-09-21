const { Op } = require("sequelize");
const { Courrier, Agency, Trip } = require("../models");
const BaseService = require("./base-service");
const roles = require("../constants/roles");
const { courrierStatus, paymentMethod, tripStatus } = require("../constants/status");
const { generateTrackingNumber } = require("../utils/reference");
const { assertCompagnyActive } = require("../utils/assertCompagnyActive");

const includeAll = [
    "compagny",
    "departureAgency",
    "arrivalAgency",
    {
        association: "trip",
        include: ["TripRoute"]
    },
    {
        association: "createdBy",
        attributes: ["id", "first_name", "last_name"]
    },
    {
        association: "receivedBy",
        attributes: ["id", "first_name", "last_name"]
    },
    {
        association: "deliveredBy",
        attributes: ["id", "first_name", "last_name"]
    }
];

class CourrierService extends BaseService {

    constructor() {
        super(Courrier);
    }

    async create(data, currentUser) {

        let compagny_id;

        if (currentUser.role === roles.SUPER_ADMIN) {

            if (!data.compagny_id) {
                throw new Error("La compagnie est obligatoire.");
            }

            compagny_id = Number(data.compagny_id);

        } else {

            compagny_id = currentUser.compagny_id;

        }

        await assertCompagnyActive(compagny_id);

        if (!data.sender_name || !data.sender_phone) {
            throw new Error("Le nom et le téléphone de l'expéditeur sont obligatoires.");
        }

        if (!data.receiver_name || !data.receiver_phone) {
            throw new Error("Le nom et le téléphone du destinataire sont obligatoires.");
        }

        // ===========================
        // AGENCES
        // ===========================

        const departureAgency = await Agency.findByPk(data.departure_agency_id);

        if (!departureAgency) {
            throw new Error("Agence de départ introuvable.");
        }

        if (Number(departureAgency.compagny_id) !== compagny_id) {
            throw new Error("Cette agence de départ n'appartient pas à votre compagnie.");
        }

        const arrivalAgency = await Agency.findByPk(data.arrival_agency_id);

        if (!arrivalAgency) {
            throw new Error("Agence d'arrivée introuvable.");
        }

        if (Number(arrivalAgency.compagny_id) !== compagny_id) {
            throw new Error("Cette agence d'arrivée n'appartient pas à votre compagnie.");
        }

        if (data.departure_agency_id === data.arrival_agency_id) {
            throw new Error("L'agence de départ et d'arrivée doivent être différentes.");
        }

        // ===========================
        // VOYAGE
        // ===========================

        const trip = await Trip.findByPk(data.trip_id);

        if (!trip) {
            throw new Error("Voyage introuvable.");
        }

        if (Number(trip.compagny_id) !== compagny_id) {
            throw new Error("Ce voyage n'appartient pas à votre compagnie.");
        }

        if (
            trip.status === tripStatus.ARRIVED ||
            trip.status === tripStatus.CANCELLED
        ) {
            throw new Error("Impossible d'enregistrer un courrier sur ce voyage.");
        }

        // ===========================
        // QUANTITÉ / POIDS / PRIX
        // ===========================

        const quantity = data.quantity || 1;

        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error("La quantité doit être un entier positif.");
        }

        if (data.weight === undefined || isNaN(data.weight) || data.weight <= 0) {
            throw new Error("Le poids est invalide.");
        }

        if (data.price === undefined || isNaN(data.price) || data.price < 0) {
            throw new Error("Le prix est invalide.");
        }

        const paidAmount =
            data.paid_amount !== undefined
                ? data.paid_amount
                : data.price;

        if (isNaN(paidAmount) || paidAmount < 0) {
            throw new Error("Le montant payé est invalide.");
        }

        if (
            data.payment_method &&
            !Object.values(paymentMethod).includes(data.payment_method)
        ) {
            throw new Error("Méthode de paiement invalide.");
        }

        const courrier = await super.create({
            compagny_id,
            tracking_number: generateTrackingNumber(),
            sender_name: data.sender_name,
            sender_phone: data.sender_phone,
            receiver_name: data.receiver_name,
            receiver_phone: data.receiver_phone,
            description: data.description,
            quantity,
            weight: data.weight,
            departure_agency_id: data.departure_agency_id,
            arrival_agency_id: data.arrival_agency_id,
            trip_id: data.trip_id,
            price: data.price,
            paid_amount: paidAmount,
            payment_method: data.payment_method,
            status: courrierStatus.REGISTERED,
            created_by: currentUser.id,
            registered_at: new Date()
        });

        return await this.getById(courrier.id, currentUser);

    }

    async getById(id, currentUser) {

        const courrier = await this.model.findByPk(id, {
            include: includeAll
        });

        if (!courrier) {
            return null;
        }

        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            courrier.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }

        return courrier;

    }

    async getByTrackingNumber(tracking_number, currentUser) {

        const courrier = await this.model.findOne({
            where: { tracking_number },
            include: includeAll
        });

        if (!courrier) {
            return null;
        }

        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            courrier.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }

        return courrier;

    }

    async update(id, data, currentUser) {

        const courrier = await this.getById(id, currentUser);

        if (!courrier) {
            throw new Error("Courrier introuvable.");
        }

        if (courrier.status !== courrierStatus.REGISTERED) {
            throw new Error(
                "Impossible de modifier un courrier déjà pris en charge."
            );
        }

        const payload = {};

        const editableFields = [
            "sender_name",
            "sender_phone",
            "receiver_name",
            "receiver_phone",
            "description",
            "quantity",
            "weight",
            "price",
            "paid_amount",
            "payment_method"
        ];

        editableFields.forEach(field => {
            if (data[field] !== undefined) {
                payload[field] = data[field];
            }
        });

        if (
            payload.payment_method &&
            !Object.values(paymentMethod).includes(payload.payment_method)
        ) {
            throw new Error("Méthode de paiement invalide.");
        }

        if (data.departure_agency_id) {

            const departureAgency = await Agency.findByPk(data.departure_agency_id);

            if (!departureAgency || departureAgency.compagny_id !== courrier.compagny_id) {
                throw new Error("Agence de départ invalide.");
            }

            payload.departure_agency_id = data.departure_agency_id;

        }

        if (data.arrival_agency_id) {

            const arrivalAgency = await Agency.findByPk(data.arrival_agency_id);

            if (!arrivalAgency || arrivalAgency.compagny_id !== courrier.compagny_id) {
                throw new Error("Agence d'arrivée invalide.");
            }

            payload.arrival_agency_id = data.arrival_agency_id;

        }

        if (data.trip_id) {

            const trip = await Trip.findByPk(data.trip_id);

            if (!trip || trip.compagny_id !== courrier.compagny_id) {
                throw new Error("Voyage invalide.");
            }

            payload.trip_id = data.trip_id;

        }

        await super.update(id, payload);

        return await this.getById(id, currentUser);

    }

    async changeStatus(id, status, currentUser, extra = {}) {

        const courrier = await this.getById(id, currentUser);

        if (!courrier) {
            throw new Error("Courrier introuvable.");
        }

        const transitions = {

            [courrierStatus.REGISTERED]: [
                courrierStatus.IN_TRANSIT,
                courrierStatus.CANCELLED
            ],

            [courrierStatus.IN_TRANSIT]: [
                courrierStatus.ARRIVED,
                courrierStatus.CANCELLED
            ],

            [courrierStatus.ARRIVED]: [
                courrierStatus.DELIVERED
            ],

            [courrierStatus.DELIVERED]: [],

            [courrierStatus.CANCELLED]: []

        };

        if (!transitions[courrier.status].includes(status)) {
            throw new Error("Transition de statut non autorisée.");
        }

        const payload = { status };

        if (status === courrierStatus.ARRIVED) {
            payload.arrived_at = new Date();
            payload.received_by = currentUser.id;
        }

        if (status === courrierStatus.DELIVERED) {

            if (!extra.receiver_identity_number || !extra.receiver_identity_number.trim()) {
                throw new Error(
                    "Le numéro de pièce d'identité du destinataire est obligatoire pour confirmer le retrait."
                );
            }

            payload.delivered_at = new Date();
            payload.delivered_by = currentUser.id;
            payload.receiver_identity_number = extra.receiver_identity_number.trim();
        }

        await super.update(id, payload);

        return await this.getById(id, currentUser);

    }

    async cancelCourrier(id, currentUser) {

        const courrier = await this.getById(id, currentUser);

        if (!courrier) {
            throw new Error("Courrier introuvable.");
        }

        if (
            courrier.status === courrierStatus.ARRIVED ||
            courrier.status === courrierStatus.DELIVERED
        ) {
            throw new Error("Impossible d'annuler un courrier déjà arrivé ou livré.");
        }

        if (courrier.status === courrierStatus.CANCELLED) {
            throw new Error("Courrier déjà annulé.");
        }

        await super.update(id, {
            status: courrierStatus.CANCELLED
        });

        return await this.getById(id, currentUser);

    }

    async delete(id, currentUser) {

        const courrier = await this.getById(id, currentUser);

        if (!courrier) {
            throw new Error("Courrier introuvable.");
        }

        if (courrier.status !== courrierStatus.REGISTERED) {
            throw new Error(
                "Impossible de supprimer un courrier déjà pris en charge."
            );
        }

        return await super.delete(id);

    }

    async Paginate(page, limit, filters = {}) {

        const where = {};

        if (filters.compagny_id) {
            where.compagny_id = filters.compagny_id;
        }

        if (filters.trip_id) {
            where.trip_id = filters.trip_id;
        }

        if (filters.departure_agency_id) {
            where.departure_agency_id = filters.departure_agency_id;
        }

        if (filters.arrival_agency_id) {
            where.arrival_agency_id = filters.arrival_agency_id;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.tracking_number) {
            where.tracking_number = {
                [Op.iLike]: `%${filters.tracking_number}%`
            };
        }

        if (filters.search) {

            where[Op.or] = [
                {
                    sender_name: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },
                {
                    sender_phone: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },
                {
                    receiver_name: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },
                {
                    receiver_phone: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                }
            ];

        }

        return await super.Paginate(page, limit, {
            where,
            include: includeAll,
            order: [
                ["createdAt", "DESC"]
            ]
        });

    }

}

module.exports = new CourrierService();
