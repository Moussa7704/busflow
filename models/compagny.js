'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Compagny extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Compagny.hasMany(models.Agency, {
        foreignKey: "company_id",
        as: "agencies"
      });
      Compagny.hasMany(models.User, {
        foreignKey: "company_id",
        as: "users"
      });
      Compagny.hasMany(models.Bus, {
        foreignKey: "company_id",
        as: "buses"
      });
      Compagny.hasMany(models.TripRoute, {
        foreignKey: "company_id",
        as: "routes"
      });
      Compagny.hasMany(models.Trip, {
        foreignKey: "company_id",
        as: "trips"
      });
    }
  }
  Compagny.init({
    name: DataTypes.STRING,
    telephone: DataTypes.STRING,
    email: DataTypes.STRING,
    adresse: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Compagny',
  });
  return Compagny;
};