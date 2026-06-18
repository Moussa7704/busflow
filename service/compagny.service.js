const { Compagny } = require('../models');
const BaseService = require('./base-service');


class CompagnyService extends BaseService {
    constructor() {
        super(Compagny)
    }
    async create(data) {

        const ExistCompagny = await this.model.findOne({
            where: { name: data.name }
        })

        if (ExistCompagny) {
            throw new Error("Une compagnie avec ce nom existe déjà")
        }

        // 2. créer si ok
        return await super.create(data)
    }

}

module.exports = new CompagnyService()