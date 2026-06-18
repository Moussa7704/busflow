class BaseService {
    constructor(model) {
        this.model = model
    }

    async create(data) {
        return await this.model.create(data)
    }

    async getAll(options = {}) {
        return await this.model.findAll(options)
    }
    async getById(id, options = {}) {
        return await this.model.getByPk(id, options)
    }
    async update(id, data) {
        const record = await this.model.getByPk(id)

        if (!record) return null

        return await record.update(data)
    }
    async delete(id) {
        const record = await this.model.getByPk(id)

        if (!record) return null

        await record.destroy()
        return true
    }

    async paginate(page = 1, limit = 10, options = {}) {
        const offset = (page - 1) * limit

        const { count, rows } = await this.model.findAndCountAll({
            ...options,
            limit: parseInt(limit),
            offset: parseInt(offset)
        })

        return {
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        }
    }
}
module.exports = BaseService