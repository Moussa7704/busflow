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
      seat_number: {
        type: Sequelize.STRING
      },
      booking_reference: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "CONFIRMED",
          "CANCELLED"
        ),
        defaultValue: "CONFIRMED"
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