'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Otp.belongsTo(models.User, {
        foreignKey: "user_id"
      });
    }
  }
  Otp.init({
    user_id: DataTypes.INTEGER,
    code: DataTypes.STRING,
    type: DataTypes.STRING,
    expires_at: DataTypes.DATE,
    is_used: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Otp',
  });
  return Otp;
};