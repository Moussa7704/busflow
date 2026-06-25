const agencyService = require("../service/agency.service");

const createAgency = async (req, res) => {
    try {

        const agency = await agencyService.create(req.body);

        return res.status(201).json({
            message: "Agence créée avec succès",
            data: agency
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const listAgency = async (req, res) => {
    try {

        const result = await agencyService.Paginate(
            req.query.page,
            req.query.limit,
            {
                company_id: req.query.company_id,
                search: req.query.search
            }
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });
    }
};

const updateAgency = async (req, res) => {
    try {

        const agency = await agencyService.update(
            req.params.id,
            req.body
        );

        if (!agency) {
            return res.status(404).json({
                message: "Agence introuvable"
            });
        }

        return res.status(200).json({
            message: "Agence mise à jour",
            data: agency
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });
    }
};

const deleteAgency = async (req, res) => {
    try {

        const result = await agencyService.delete(
            req.params.id
        );

        if (!result) {
            return res.status(404).json({
                message: "Agence introuvable"
            });
        }

        return res.status(200).json({
            message: "Agence supprimée"
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    createAgency,
    listAgency,
    updateAgency,
    deleteAgency
};