'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TripRoute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     TripRoute.belongsTo(models.Compagny, {
        foreignKey: "compagny_id",
        as: "Compagnies"
      })
    }
  }
  TripRoute.init({
    company_id: DataTypes.INTEGER,
    departure_city: DataTypes.STRING,
    arrival_city: DataTypes.STRING,
    distance_km: DataTypes.FLOAT,
    estimated_duration: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TripRoute',
  });
  return TripRoute;
};