const compagnyService = require("../service/compagny.service")

const createCompagny = async (req, res) => {
    try {
        const compagny = await compagnyService.create(req.body)

        return res.status(201).json({
            success: true,
            message: "Compagnie créée avec succès",
            data: compagny
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
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

        return res.status(200).json({
            success: true,
            message: "Liste des compagnies",
            data: result.data,
            pagination: result.pagination
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
const getCompagnyById = async (req, res) => {

    try {

        const compagny = await compagnyService.getById(req.params.id);

        if (!compagny) {
            return res.status(404).json({
                message: "Compagnie introuvable"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Compagnie récupérée",
            data: compagny
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
const updateCompagny = async (req, res) => {
    try {
        const compagny = await compagnyService.update(req.params.id, req.body)

        if (!compagny) {
            return res.status(404).json({
                success: false,
                message: "Compagnie introuvable"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Compagnie mise à jour",
            data: compagny
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteCompagny = async (req, res) => {
    try {
        const result = await compagnyService.delete(req.params.id)

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Compagnie introuvable"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Compagnie supprimée"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    createCompagny,
    listCompagny,
    getCompagnyById,
    updateCompagny,
    deleteCompagny
}