const compagnyService = require("../service/compagny.service")

const createCompagny = async (req, res) => {
    try {
        const compagny = await compagnyService.create(req.body)

        return res.status(201).json({
            message: "Compagnie créée",
            data: compagny
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

const getAllCompanies = async (req, res) => {
    try {
        const companies = await compagnyService.getAll()

        return res.status(200).json({
            data: companies
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const getCompanies = async (req, res) => {
    try {
        const { page, limit } = req.query

        const result = await compagnyService.paginate(
            page || 1,
            limit || 10
        )

        return res.status(200).json(result)

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


module.exports = {
    createCompagny,
    getCompanies,
    getAllCompanies
}