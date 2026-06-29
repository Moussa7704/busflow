const agencyService = require("../service/agency.service");
const { sendResponse } = require("../utils/message");

const createAgency = async (req, res) => {
    try {

        let compagny_id = req.user.compagny_id;

        if (req.user.role === "SUPER_ADMIN") {
            compagny_id = req.body.compagny_id;
        }

        const payload = {
            name: req.body.name,
            city: req.body.city,
            address: req.body.address,
            phone: req.body.phone,
            compagny_id
        }


        const agences = await agencyService.create(payload);

        return sendResponse(res, {
            message: 'Agence créée avec succès',
            data: agences,
            status: 201
        })

    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        })
    }
};
const listAgency = async (req, res) => {
    try {

        const filters = {
            search: req.query.search,
            status: req.query.status
        };

        if (req.user.role !== "SUPER_ADMIN") {
            filters.compagny_id = req.user.compagny_id;
        } else {
            filters.compagny_id = req.query.compagny_id;
        }

        // const agencies = await agencyService.list({ where });

        const agences = await agencyService.Paginate(
            req.query.page,
            req.query.limit,
            filters
        );

        return sendResponse(res, {
            message: "Liste des Agences",
            data: agences.data,
            pagination: agences.pagination,
            status: 200
        })
    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        })
    }
};
const updateAgency = async (req, res) => {
    try {

        const agences = await agencyService.getById(req.params.id);

        if (!agences) {
            return sendResponse(res, {
                success: false,
                message: 'Agence introuvable',
                status: 404
            })
        }

        if (
            req.user.role !== "SUPER_ADMIN" &&
            agences.compagny_id !== req.user.compagny_id
        ) {
            return sendResponse(res, {
                success: false,
                message: "Accès refusé",
                status: 403
            });
        }

        const updated = await agencyService.update(req.params.id, req.body);

        return sendResponse(res, {
            message: 'Agence mise à jour',
            data: updated,
            status: 200
        })
    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        })
    }
};
const deleteAgency = async (req, res) => {
    try {
        const agences = await agencyService.getById(req.params.id);

        if (!agences) {
            return sendResponse(res, {
                success: false,
                message: 'Agence introuvable',
                status: 404
            });
        }

        if (
            req.user.role !== "SUPER_ADMIN" &&
            agency.company_id !== req.user.company_id
        ) {
            return sendResponse(res, {
                success: false,
                message: "Accès refusé",
                status: 403
            });
        }

        await agencyService.delete(req.params.id);

        return sendResponse(res, {
            success: false,
            message: 'Agence supprimée',
            status: 200
        })
    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        })
    }
};

module.exports = {
    createAgency,
    listAgency,
    updateAgency,
    deleteAgency
};