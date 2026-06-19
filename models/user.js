'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Compagny, {
        foreignKey: "compagny_id",
        as: "Compagnies"
      })
      User.hasMany(models.Otp, {
        foreignKey: "user_id",
        as: "otps"
      });
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "Role"
      });
      User.belongsTo(models.Agency, {
        foreignKey: "agency_id",
        as: "agency"
      });
    }
  }
  User.init({
    compagny_id: DataTypes.INTEGER,
    agency_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};