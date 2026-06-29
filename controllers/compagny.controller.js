const compagnyService = require("../service/compagny.service");
const { sendResponse } = require("../utils/message");

const createCompagny = async (req, res) => {
    try {
        const compagny = await compagnyService.create(req.body)

        return sendResponse(res, {
            message: "Compagnie créée avec succès",
            data: compagny,
            status: 201
        });

    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
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

        return sendResponse(res, {
            message: "Liste des compagnies",
            data: result.data,
            pagination: result.pagination,
            status: 200
        });

    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });
    }
}
const getCompagnyById = async (req, res) => {

    try {

        const compagny = await compagnyService.getById(req.params.id);

        if (!compagny) {
            return sendResponse(res, {
                success: false,
                message: 'Compagnie introuvable',
                status: 404
            })
        }

        return sendResponse(res, {
            message: "Compagnie récupérée",
            data: compagny,
            status: 200
        })

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        })
    }

}
const updateCompagny = async (req, res) => {
    try {
        const compagny = await compagnyService.update(req.params.id, req.body)

        if (!compagny) {
            return sendResponse(res, {
                success: false,
                message: "Compagnie introuvable",
                status: 404
            })
        }

        return sendResponse(res, {
            message: 'Compagnie mise à jour',
            data: compagny,
            status: 200
        })

    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        })
    }
}

const deleteCompagny = async (req, res) => {
    try {
        const result = await compagnyService.delete(req.params.id)

        if (!result) {
            return sendResponse(res, {
                success: false,
                message: "Compagnie introuvable",
                status: 404
            })
        }
        return sendResponse(res, {
            message: 'Compagnie supprimée',
            status: 200
        })
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}


module.exports = {
    createCompagny,
    listCompagny,
    getCompagnyById,
    updateCompagny,
    deleteCompagny
}