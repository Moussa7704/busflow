const { Passenger } = require("../models");
const BaseService = require("./base-service");
const { Op } = require("sequelize");
const roles = require("../constants/roles");


class PassengerService extends BaseService {

    constructor() {
        super(Passenger);
    }
    
    async create(data, currentUser) {

        let compagny_id;

        if (currentUser.role === roles.SUPER_ADMIN) {
            if (!data.compagny_id) {
                throw new Error("La compagnie est obligatoire.");
            }
            compagny_id = data.compagny_id;
        } else {
            compagny_id = currentUser.compagny_id;
        }

        const existPassenger = await this.model.findOne({

            where: {
                phone: data.phone,
                compagny_id
            }

        });

        if (existPassenger) {
            throw new Error(
                "Un passager avec ce numéro existe déjà."
            );
        }
        const payload = {
            compagny_id,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            email: data.email,
            gender: data.gender,
            birth_date: data.birth_date
        };
        return await super.create(payload);
    }
    async getById(id, currentUser) {

        const passenger = await this.model.findByPk(id);

        if (!passenger) {
            return null;
        }

        if (
            currentUser.role !== roles.SUPER_ADMIN &&
            passenger.compagny_id !== currentUser.compagny_id
        ) {

            throw new Error("Accès refusé.");
        }
        return passenger;
    }
    async Paginate(page, limit, filters = {}) {

        const where = {};

        if(filters.compagny_id){
            where.compagny_id = filters.compagny_id;
        }

        if(filters.search){

            where[Op.or] = [

                {
                    first_name:{
                        [Op.iLike]: `%${filters.search}%`
                    }
                },

                {
                    last_name:{
                        [Op.iLike]: `%${filters.search}%`
                    }
                },

                {
                    phone:{
                        [Op.iLike]: `%${filters.search}%`
                    }
                },

                {
                    email:{
                        [Op.iLike]: `%${filters.search}%`
                    }
                }
            ]
        }
        return await super.Paginate(
            page,
            limit,
            {
                where,

                order:[
                    ["createdAt","DESC"]
                ]
            }
        );
    }
    async update(id,data,currentUser){

        const passenger = await this.getById(
            id,
            currentUser
        );
        if(!passenger){

            throw new Error(
                "Passager introuvable."
            );

        }
        return await super.update(
            id,
            data
        );


    }




}


module.exports = new PassengerService();