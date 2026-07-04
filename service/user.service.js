const { User, Agency } = require("../models");
const BaseService = require("./base-service");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize")

class UserService extends BaseService {
    constructor() {
        super(User);
    }

    async create(data, currentUser) {

        const existUser = await this.model.findOne({
            where: { email: data.email }
        });

        if (existUser) {
            throw new Error("Un utilisateur possède déjà cette adresse email.");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        let compagny_id;

        if (currentUser?.role === "SUPER_ADMIN") {

            if (!data.compagny_id) {
                throw new Error("La compagnie est obligatoire.");
            }

            compagny_id = data.compagny_id;

        } else {

            compagny_id = currentUser.compagny_id;
        }

        // Vérifier agence appartient à la compagnie
        if (data.agency_id) {

            const agency = await Agency.findByPk(data.agency_id);

            if (!agency || agency.compagny_id !== compagny_id) {
                throw new Error("Agence invalide pour cette compagnie.");
            }
        }

        const payload = {
            compagny_id,
            agency_id: data.agency_id,
            role_id: data.role_id,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            email: data.email,
            password: hashedPassword,
            is_active: data.is_active ?? true
        };

        return await super.create(payload);
    }

    async update(id, data) {

        const user = await this.model.findByPk(id);
        if (!user) return null;

        if (data.email) {
            const existingUser = await this.model.findOne({
                where: {
                    email: data.email,
                    id: { [Op.ne]: id }
                }
            });

            if (existingUser) {
                throw new Error("Email déjà utilisé");
            }
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        if (data.agency_id) {
            const agency = await Agency.findByPk(data.agency_id);

            if (!agency || agency.compagny_id !== user.compagny_id) {
                throw new Error("Agence invalide");
            }
        }

        return await super.update(id, data);
    }
    async Paginate(page, limit, filters = {}) {

        const where = {};

        if (filters.compagny_id) {
            where.compagny_id = filters.compagny_id;
        }

        if (filters.role_id) {
            where.role_id = filters.role_id;
        }

        if (filters.agency_id) {
            where.agency_id = filters.agency_id;
        }

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active === "true";
        }

        if (filters.search) {
            where[Op.or] = [
                {
                    first_name: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },
                {
                    last_name: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },
                {
                    email: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                },
                {
                    phone: {
                        [Op.iLike]: `%${filters.search}%`
                    }
                }
            ];
        }

        return await super.Paginate(page, limit, {
            where,
            include: [
                "Compagny",
                "Role",
                "Agency"
            ],
            attributes: {
                exclude: ["password"]
            },
            order: [["createdAt", "DESC"]]
        });
    }

}

module.exports = new UserService();