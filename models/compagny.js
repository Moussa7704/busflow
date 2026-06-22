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
        foreignKey: "compagny_id",
        as: "agencies"
      });
      Compagny.hasMany(models.User, {
        foreignKey: "compagny_id",
        as: "users"
      });
      Compagny.hasMany(models.Bus, {
        foreignKey: "compagny_id",
        as: "buses"
      });
      Compagny.hasMany(models.TripRoute, {
        foreignKey: "compagny_id",
        as: "routes"
      });
      Compagny.hasMany(models.Trip, {
        foreignKey: "compagny_id",
        as: "trips"
      });

      Compagny.hasMany(models.Booking, {
        foreignKey: "compagny_id",
        as: "bookings"
      });

      Compagny.hasMany(models.Ticket, {
        foreignKey: "compagny_id",
        as: "tickets"
      });
    }
  }
  Compagny.init({
    name: DataTypes.STRING,
    telephone: DataTypes.STRING,
    email: DataTypes.STRING,
    adresse: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Compagny',
  });
  return Compagny;
};