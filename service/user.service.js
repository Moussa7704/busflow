const { User, Agency } = require("../models");
const BaseService = require("./base-service");
const bcrypt = require("bcrypt");

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

        if (currentUser?.Role?.name === "SUPER_ADMIN") {

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
}

module.exports = new UserService();