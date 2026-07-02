const { Bus } = require('../models');
const { Compagny } = require('../models');
const BaseService = require('./base-service');
const { Op } = require("sequelize")
const roles = require('../constants/roles')


class BusService extends BaseService {
    constructor() {
        super(Bus)
    }
    async create(data, currentUser) {

        if (currentUser.role === roles.AGENCY_ADMIN) {
            throw new Error("Accès refusé. Création de bus non autorisée.");
        }

        const ExistBus = await this.model.findOne({
            where: { plate_number: data.plate_number }
        })

        if (ExistBus) {
            throw new Error("Un bus avec ce numéro d'immatriculation existe déjà")
        }

        const existBusNumber = await this.model.findOne({
            where: {
                bus_number: data.bus_number
            }
        });

        if (data.bus_number) {
            const existBusNumber = await this.model.findOne({
                where: {
                    bus_number: data.bus_number
                }
            });

            if (existBusNumber) {
                throw new Error("Ce numéro de bus existe déjà.");
            }
        }

        if (!data.capacity || data.capacity <= 0) {
            throw new Error("La capacité du bus est invalide.");
        }

        let compagny_id;

        if (currentUser.role === roles.SUPER_ADMIN) {

            if (!data.compagny_id) {
                throw new Error("La compagnie est obligatoire.");
            }

            compagny_id = data.compagny_id;

        } else {

            compagny_id = currentUser.compagny_id;

        }
        const payload = {
            compagny_id,
            plate_number: data.plate_number,
            bus_number: data.bus_number,
            capacity: data.capacity,
            type: data.type,
            status: data.status
        };
        return await super.create(payload)
    }

    async update(id, data, currentUser) {

        const bus = await this.model.findByPk(id);

        if (!bus) {
            return null;
        }


        if (currentUser.role === roles.AGENCY_ADMIN) {
            throw new Error("Accès refusé.");
        }

        // Vérification SaaS
        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            bus.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }

        // Vérifier la plaque
        if (data.plate_number) {

            const existBus = await this.model.findOne({
                where: {
                    plate_number: data.plate_number,
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            if (existBus) {
                throw new Error("Un bus avec ce numéro d'immatriculation existe déjà.");
            }
        }

        // Vérifier le numéro interne
        if (data.bus_number) {

            const existBusNumber = await this.model.findOne({
                where: {
                    bus_number: data.bus_number,
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            if (existBusNumber) {
                throw new Error("Ce numéro de bus existe déjà.");
            }
        }

        // Vérifier capacité
        if (
            data.capacity !== undefined &&
            Number(data.capacity) <= 0
        ) {
            throw new Error("La capacité du bus est invalide.");
        }

        // Vérifier le statut
        if (
            data.status &&
            !Object.values(busStatus).includes(data.status)
        ) {
            throw new Error("Statut du bus invalide.");
        }

        const payload = {
            plate_number: data.plate_number ?? bus.plate_number,
            bus_number: data.bus_number ?? bus.bus_number,
            capacity: data.capacity ?? bus.capacity,
            type: data.type ?? bus.type,
            status: data.status ?? bus.status
        };

        return await bus.update(payload);
    }

    async delete(id, currentUser) {

        const bus = await this.model.findByPk(id);

        if (!bus) {
            return null;
        }

        if (currentUser.role === roles.AGENCY_ADMIN) {
            throw new Error("Accès refusé.");
        }

        // Vérification SaaS
        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            bus.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }

        return await super.delete(id);
    }

    async Paginate(page, limit, filters = {}) {

        const where = {};

        // SaaS
        if (filters.compagny_id) {
            where.compagny_id = filters.compagny_id;
        }

        // Recherche
        if (filters.search) {

            where[Op.or] = [

                {
                    plate_number: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },

                {
                    bus_number: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },

                {
                    type: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                }

            ];
        }

        // Type
        if (filters.type) {
            where.type = filters.type;
        }

        // Status
        if (filters.status) {
            where.status = filters.status;
        }

        // Capacité
        if (filters.capacity) {
            where.capacity = filters.capacity;
        }

        return await super.Paginate(
            page,
            limit,
            {
                where,
                include: [
                    "Compagny"
                ],
                order: [
                    ["createdAt", "DESC"]
                ]
            }
        );
    }

    async getById(id, currentUser) {

        const bus = await this.model.findByPk(id, {
            include: [
                "Compagny"
            ]
        });

        if (!bus) {
            return null;
        }

        // SUPER_ADMIN ok
        if (currentUser.role === roles.SUPER_ADMIN) {
            return bus;
        }

        // SaaS
        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            bus.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }

        return bus;
    }

    async changeStatus(id, status, currentUser) {

        const bus = await this.getById(id, currentUser);

        if (!bus) {
            return null;
        }

        if (currentUser.role === roles.AGENCY_ADMIN) {
            throw new Error("Accès refusé.");
        }

        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            bus.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }

        if (!Object.values(busStatus).includes(status)) {
            throw new Error("Statut invalide.");
        }

        bus.status = status;

        await bus.save();

        return bus;
    }
}


module.exports = new BusService()