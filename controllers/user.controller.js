const { User } = require("../models")
const bcrypt = require("bcrypt")
const userService = require("../service/user.service")
const { sendResponse } = require("../utils/message")
const roles = require('../constants/roles')

const createUser = async (req, res) => {
    try {


        const user = await userService.create(req.body, req.user)


        return sendResponse(res, {
            message: "Utilisateur créé avec succès",
            data: user,
            status: 201
        });
    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 400
        });
    }
}
const listUsers = async (req, res) => {
    try {

        const filters = {
            search: req.query.search,
            role_id: req.query.role_id,
            agency_id: req.query.agency_id,
            is_active: req.query.is_active
        };

        if (req.user.role !== roles.SUPER_ADMIN) {
            filters.compagny_id = req.user.compagny_id;
        } else {
            filters.compagny_id = req.query.compagny_id;
        }

        const users = await userService.Paginate(
            req.query.page || 1,
            req.query.limit || 10,
            filters,
            req.user
        );

        return sendResponse(res, {
            message: "Liste des utilisateurs",
            data: users.data,
            pagination: users.pagination,
            status: 200
        });

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });

    }
};
const updateUser = async (req, res) => {
    try {

        const user = await userService.getById(req.params.id);

        if (!user) {
            return sendResponse(res, {
                success: false,
                message: "Utilisateur introuvable",
                status: 404
            });
        }

        // SUPER_ADMIN : accès total
        if (req.user.role !== roles.SUPER_ADMIN) {

            // COMPAGNY_ADMIN : uniquement sa compagnie
            if (
                req.user.role === roles.COMPAGNY_ADMIN &&
                user.compagny_id !== req.user.compagny_id
            ) {
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé",
                    status: 403
                });
            }

            // AGENCY_ADMIN : uniquement son agence
            if (req.user.role === roles.AGENCY_ADMIN &&
                (
                    user.compagny_id !== req.user.compagny_id ||
                    user.agency_id !== req.user.agency_id
                )
            ) {
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé",
                    status: 403
                });
            }
        }

        const updated = await userService.update(req.params.id, req.body);

        return sendResponse(res, {
            message: "Utilisateur mis à jour",
            data: updated,
            status: 200
        });

    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });
    }
};
const getUserById = async (req, res) => {
    try {

        const user = await userService.getById(req.params.id, {
            include: ["Role", "Agency", "Compagny"],
            attributes: {
                exclude: ["password"]
            }
        });

        if (!user) {
            return sendResponse(res, {
                success: false,
                message: "Utilisateur introuvable",
                status: 404
            });
        }

        // SUPER_ADMIN
        if (req.user.role !== roles.SUPER_ADMIN) {

            if (
                req.user.role === roles.COMPAGNY_ADMIN &&
                user.compagny_id !== req.user.compagny_id
            ) {
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé",
                    status: 403
                });
            }

            if (
                req.user.role === roles.AGENCY_ADMIN &&
                (
                    user.compagny_id !== req.user.compagny_id ||
                    user.agency_id !== req.user.agency_id
                )
            ) {
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé",
                    status: 403
                });
            }
        }

        return sendResponse(res, {
            message: "Utilisateur",
            data: user,
            status: 200
        });

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });

    }
};
const deleteUser = async (req, res) => {
    try {

        const user = await userService.getById(req.params.id);

        if (!user) {
            return sendResponse(res, {
                success: false,
                message: "Utilisateur introuvable",
                status: 404
            });
        }

        // SUPER_ADMIN : accès total
        if (req.user.role !== "SUPER_ADMIN") {

            // COMPAGNY_ADMIN : uniquement sa compagnie
            if (
                req.user.role === "COMPAGNY_ADMIN" &&
                user.compagny_id !== req.user.compagny_id
            ) {
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé",
                    status: 403
                });
            }

            // AGENCY_ADMIN : uniquement son agence
            if (
                req.user.role === "AGENCY_ADMIN" &&
                (
                    user.compagny_id !== req.user.compagny_id ||
                    user.agency_id !== req.user.agency_id
                )
            ) {
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé",
                    status: 403
                });
            }
        }

        await userService.delete(req.params.id);

        return sendResponse(res, {
            message: "Utilisateur supprimé avec succès",
            status: 200
        });

    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });
    }
};
const changeUserStatus = async (req, res) => {
    try {

        const user = await userService.getById(req.params.id);

        if (!user) {
            return sendResponse(res, {
                success: false,
                message: "Utilisateur introuvable",
                status: 404
            });
        }

        if (req.user.role !== roles.SUPER_ADMIN) {

            if (
                req.user.role === roles.COMPAGNY_ADMIN &&
                user.compagny_id !== req.user.compagny_id
            ) {
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé",
                    status: 403
                });
            }

            if (
                req.user.role === roles.AGENCY_ADMIN &&
                (
                    user.compagny_id !== req.user.compagny_id ||
                    user.agency_id !== req.user.agency_id
                )
            ) {
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé",
                    status: 403
                });
            }
        }

        user.is_active = !user.is_active;

        await user.save();

        return sendResponse(res, {
            message: `Utilisateur ${user.is_active ? "activé" : "désactivé"} avec succès`,
            data: user,
            status: 200
        });

    } catch (error) {

        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });

    }
};
const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return sendResponse(res, {
                success: false,
                message: "Mot de passe requis",
                status: 400
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return sendResponse(res, {
                success: false,
                message: "Utilisateur introuvable",
                status: 404
            });
        }

        // SUPER_ADMIN => accès total
        if (req.user.role !== roles.SUPER_ADMIN) {

            // COMPAGNY ADMIN => même compagnie seulement
            if (
                req.user.role === roles.COMPAGNY_ADMIN &&
                user.compagny_id !== req.user.compagny_id
            ) {
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé (compagnie)",
                    status: 403
                });
            }

            // AGENCY ADMIN => interdit (sécurité)
            if (req.user.role === roles.AGENCY_ADMIN) {
                return sendResponse(res, {
                    success: false,
                    message: "Accès refusé",
                    status: 403
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.update({
            password: hashedPassword
        });

        return sendResponse(res, {
            success: true,
            message: "Mot de passe mis à jour avec succès",
            status: 200
        });

    } catch (error) {
        return sendResponse(res, {
            success: false,
            message: error.message,
            status: 500
        });
    }
};

module.exports = {
    createUser,
    listUsers,
    updateUser,
    deleteUser,
    getUserById,
    changeUserStatus,
    changePassword
}