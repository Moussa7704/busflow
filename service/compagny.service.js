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

    async update(id, data) {

        const compagny = await this.model.findByPk(id)

        if (!compagny) {
            return null
        }

        // Vérifier si le nom est déjà utilisé par une autre compagnie
        if (data.name) {

            const existCompagny = await this.model.findOne({
                where: {
                    name: data.name
                }
            })

            if (existCompagny && existCompagny.id !== Number(id)) {
                throw new Error("Une compagnie avec ce nom existe déjà")
            }
        }

        return await compagny.update(data)
    }

}

module.exports = new CompagnyService()