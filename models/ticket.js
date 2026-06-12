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
      // define association here
    }
  }
  Ticket.init({
    booking_id: DataTypes.INTEGER,
    ticket_number: DataTypes.STRING,
    qr_code: DataTypes.TEXT,
    used: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};