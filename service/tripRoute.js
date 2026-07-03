const { TripRoute } = require("../models");
const BaseService = require("./base-service");
const { Op } = require("sequelize");
const roles = require("../constants/roles");

class TripRouteService extends BaseService {
    constructor() {
        super(TripRoute);
    }

    async create(data, currentUser) {

        let compagny_id;

        if (currentUser.role === roles.SUPER_ADMIN) {

            if (!data.compagny_id) {
                throw new Error("La compagnie est obligatoire.");
            }

            compagny_id = data.compagny_id;

        } else {

            compagny_id = currentUser.compagny_id;
        }

        const exist = await this.model.findOne({
            where: {
                compagny_id,
                departure_city: data.departure_city,
                arrival_city: data.arrival_city
            }
        });

        if (exist) {
            throw new Error("Cette route existe déjà.");
        }

        return await super.create({
            compagny_id,
            departure_city: data.departure_city.trim().toUpperCase(),
            arrival_city: data.arrival_city.trim().toUpperCase(),
            distance_km: data.distance_km,
            estimated_duration: data.estimated_duration
        });
    }

    async update(id, data, currentUser) {

        const route = await this.model.findByPk(id);

        if (!route) return null;

        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            route.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }

        const exist = await this.model.findOne({
            where: {
                id: { [Op.ne]: id },
                compagny_id: route.compagny_id,
                departure_city: data.departure_city.trim().toUpperCase(),
                arrival_city: data.arrival_city.trim().toUpperCase()
            }
        });

        if (exist) {
            throw new Error("Cette route existe déjà.");
        }

        return await route.update(data);
    }

    async delete(id, currentUser) {

        const route = await this.getById(id, currentUser);

        if (!route) return null;

        await route.destroy();

        return true;
    }

    async getById(id, currentUser) {

        const route = await this.model.findByPk(id, {
            include: ["Compagny"]
        });

        if (!route) return null;

        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            route.compagny_id !== currentUser.compagny_id
        ) {
            throw new Error("Accès refusé.");
        }

        return route;
    }

    async Paginate(page, limit, filters = {}, currentUser) {

        const where = {};

        if (currentUser.role !== roles.SUPER_ADMIN) {
            where.compagny_id = currentUser.compagny_id;
        } else if (filters.compagny_id) {
            where.compagny_id = filters.compagny_id;
        }

        if (filters.search) {

            where[Op.or] = [
                {
                    departure_city: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },
                {
                    arrival_city: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                }
            ];
        }

        return await super.Paginate(page, limit, {
            where,
            include: ["Compagny"],
            order: [["createdAt", "DESC"]]
        });
    }
}

module.exports = new TripRouteService();