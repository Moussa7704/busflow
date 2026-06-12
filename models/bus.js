'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Bus.belongsTo(models.Compagny, {
        foreignKey: "company_id",
        as: "company"
      });

      Bus.hasMany(models.Trip, {
        foreignKey: "bus_id",
        as: "trips"
      });

    }
  }
  Bus.init({
    company_id: DataTypes.INTEGER,
    plate_number: DataTypes.STRING,
    bus_number: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    type: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bus',
  });
  return Bus;
};