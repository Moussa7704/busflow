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
      // define association here
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