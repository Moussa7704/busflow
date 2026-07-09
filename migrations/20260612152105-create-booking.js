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
      seat_number: {
        type: Sequelize.STRING
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
        defaultValue: "CONFIRMED"
      },
      booking_channel: {
        type: Sequelize.ENUM(
          "ONLINE",
          "GUICHE"
        ),
        defaultValue: "GUICHE"
      },
      payment_status: {
        type: Sequelize.ENUM(
          "PENDING",
          "CONFIRMED",
          "CANCELLED"
        ),
        defaultValue: "PENDING"
      },
      payment_method: {
        type: Sequelize.ENUM(
          "CASH",
          "CARD",
          "MOBILE_MONEY"
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