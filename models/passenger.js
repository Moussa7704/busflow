'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Passenger.hasMany(models.Booking, {
        foreignKey: "passenger_id",
        as: "bookings"
      })
    }
  }
  Passenger.init({
    compagny_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    identity_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Passenger',
  });
  return Passenger;
};