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

const listCompagny = async (req, res) => {
    try {

        const result = await compagnyService.Paginate(
            req.query.page || 1,
            req.query.limit || 10,
            {
                search: req.query.search,
                status: req.query.status
            }
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }
}

const updateCompagny = async (req, res) => {
    try {
        const compagny = await compagnyService.update(req.params.id, req.body)

        if (!compagny) {
            return res.status(404).json({
                message: "Compagnie introuvable"
            })
        }

        return res.status(200).json({
            message: "Compagnie mise à jour",
            data: compagny
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const deleteCompagny = async (req, res) => {
    try {
        const result = await compagnyService.delete(req.params.id)

        if (!result) {
            return res.status(404).json({
                message: "Compagnie introuvable"
            })
        }

        return res.status(200).json({
            message: "Compagnie supprimée"
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


module.exports = {
    createCompagny,
    listCompagny,
    updateCompagny,
    deleteCompagny
}