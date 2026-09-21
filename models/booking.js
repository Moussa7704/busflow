'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Trip, {
        foreignKey: "trip_id",
        as: "trip"
      });
      Booking.belongsTo(models.Passenger, {
        foreignKey: "passenger_id",
        as: "passenger"
      });

      Booking.hasOne(models.Ticket, {
        foreignKey: "booking_id",
        as: "ticket"
      });
      Booking.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "createdBy"
      });
    }
  }
  Booking.init({
    trip_id: DataTypes.INTEGER,
    compagny_id: DataTypes.INTEGER,
    passenger_id: DataTypes.INTEGER,
    seat_number: DataTypes.INTEGER,
    booking_reference: DataTypes.STRING,
    status: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    payment_methode: DataTypes.STRING,
    paid_amount: DataTypes.DECIMAL,
    //booking_channel: DataTypes.STRING,
    //payment_status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};