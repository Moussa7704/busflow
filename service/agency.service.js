const { Agency } = require('../models');
const BaseService = require("./base-service");

class AgencyService extends BaseService {
    constructor() {
        super(Agency)
    }
    async create(data) {
        const agency = await this.model.findOne({
            where: {
                compagny_id: data.compagny_id,
                name: data.name
            }
        })

        if (agency) {
            return res.status(400).json({
                message: 'Une agence avec ce nom existe déjà dans cette compagnie'
            })
        }
        return super.create(data)
    }

    async Paginate(page = 1, limit = 10, filters = {}) {

        const where = {};

        if (filters.company_id) {
            where.company_id = filters.company_id;
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
                order: [['createdAt', 'DESC']]
            }
        );
    }
}

module.exports = new AgencyService();