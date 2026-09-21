const { Agency } = require('../models');
const BaseService = require("./base-service");
const { assertCompagnyActive } = require("../utils/assertCompagnyActive");

class AgencyService extends BaseService {
    constructor() {
        super(Agency)
    }
    async create(data) {

        if (!data.compagny_id) {
            throw new Error(
                "La compagnie est obligatoire."
            );
        }

        await assertCompagnyActive(data.compagny_id);

        const agency = await this.model.findOne({
            where: {
                compagny_id: data.compagny_id,
                name: data.name
            }
        })

        if (agency) {
            throw new Error(
                "Une agence avec ce nom existe déjà dans cette compagnie"
            );
        }
        return super.create(data)
    }

    async Paginate(page = 1, limit = 10, filters = {}) {

        const where = {};

        if (filters.compagny_id) {
            where.compagny_id = filters.compagny_id;
        }

        if (filters.search) {
            where.name = {
                [Op.iLike]: `%${filters.search}%`
            };
        }

        return await super.Paginate(
            page,
            limit,
            {
                where,
                order: [["id", "ASC"]]
            }
        );
    }
}

module.exports = new AgencyService();