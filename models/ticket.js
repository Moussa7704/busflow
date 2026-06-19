'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ticket.belongsTo(models.Booking, {
        foreignKey: "booking_id",
        as: "booking"
      });
    }
  }
  Ticket.init({
    booking_id: DataTypes.INTEGER,
    ticket_number: DataTypes.STRING,
    compagny_id: DataTypes.INTEGER,
    qr_code: DataTypes.TEXT,
    used: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};