'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Agency.belongsTo(models.Compagny, {
        foreignKey: "company_id",
        as: "compagny"
      });

      Agency.hasMany(models.User, {
        foreignKey: "agency_id",
        as: "users"
      });

    }
  }
  Agency.init({
    company_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Agency',
  });
  return Agency;
};