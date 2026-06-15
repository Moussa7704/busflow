'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Otps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      code: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM(
          "LOGIN",
          "RESET_PASSWORD",
          "PHONE_VERIFICATION",
          "EMAIL_VERIFICATION",
          "RESEND_OTP"
        ),
        allowNull: false
      },
      expires_at: {
        type: Sequelize.DATE
      },
      is_used: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Otps');
  }
};