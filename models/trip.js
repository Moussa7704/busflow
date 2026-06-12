'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trip.init({
    company_id: DataTypes.INTEGER,
    route_id: DataTypes.INTEGER,
    bus_id: DataTypes.INTEGER,
    departure_time: DataTypes.DATE,
    arrival_time: DataTypes.DATE,
    price: DataTypes.DECIMAL,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Trip',
  });
  return Trip;
};