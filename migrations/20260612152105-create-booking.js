'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trip_id: {
        type: Sequelize.INTEGER
      },
      passenger_id: {
        type: Sequelize.INTEGER
      },
      compagny_id: {
        type: Sequelize.INTEGER
      },
      booking_reference: {
        type: Sequelize.STRING,
        unique: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "CONFIRMED",
          "CANCELLED"
        ),
        defaultValue: "PENDING"
      },
      // booking_channel: {
      //   type: Sequelize.ENUM(
      //     "ONLINE",
      //     "OFFICE"
      //   ),
      //   defaultValue: "OFFICE"
      // },
      // payment_status: {
      //   type: Sequelize.ENUM(
      //     "PENDING",
      //     "PAID",
      //     "FAILED",
      //     "REFUNDED"
      //   ),
      //   defaultValue: "PENDING"
      // },
      payment_method: {
        type: Sequelize.ENUM(
          "CASH",
          "Orange Money"
        ),
        defaultValue: "CASH"
      },
      paid_amount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0.00
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
    await queryInterface.dropTable('Bookings');
  }
};