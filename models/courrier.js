'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Courrier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Courrier.belongsTo(models.Compagny, {
        foreignKey: "compagny_id",
        as: "compagny"
      });
      Courrier.belongsTo(models.Agency, {
        foreignKey: "departure_agency_id",
        as: "departureAgency"
      });
      Courrier.belongsTo(models.Agency, {
        foreignKey: "arrival_agency_id",
        as: "arrivalAgency"
      });
      Courrier.belongsTo(models.Trip, {
        foreignKey: "trip_id",
        as: "trip"
      });
      Courrier.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "createdBy"
      });
      Courrier.belongsTo(models.User, {
        foreignKey: "received_by",
        as: "receivedBy"
      });
      Courrier.belongsTo(models.User, {
        foreignKey: "delivered_by",
        as: "deliveredBy"
      });
    }
  }
  Courrier.init({
    compagny_id: DataTypes.INTEGER,
    tracking_number: DataTypes.STRING,
    sender_name: DataTypes.STRING,
    sender_phone: DataTypes.STRING,
    receiver_name: DataTypes.STRING,
    receiver_phone: DataTypes.STRING,
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    weight: DataTypes.DECIMAL,
    departure_agency_id: DataTypes.INTEGER,
    arrival_agency_id: DataTypes.INTEGER,
    trip_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    paid_amount: DataTypes.DECIMAL,
    payment_method: DataTypes.STRING,
    status: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    received_by: DataTypes.INTEGER,
    delivered_by: DataTypes.INTEGER,
    registered_at: DataTypes.DATE,
    arrived_at: DataTypes.DATE,
    delivered_at: DataTypes.DATE,
    receiver_identity_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Courrier',
  });
  return Courrier;
};
