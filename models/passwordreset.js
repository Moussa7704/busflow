'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    static associate(models) {
      PasswordReset.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });
    }
  }
  PasswordReset.init({
    user_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    expires_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PasswordReset',
  });
  return PasswordReset;
};
