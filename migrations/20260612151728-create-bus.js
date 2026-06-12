'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Buses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      compagny_id: {
        type: Sequelize.INTEGER
      },
      plate_number: {
        type: Sequelize.STRING
      },
      bus_number: {
        type: Sequelize.STRING
      },
      capacity: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM(
          "AVAILABLE",
          "MAINTENANCE",
          "OUT_OF_SERVICE"
        ),
        defaultValue: "AVAILABLE"
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
    await queryInterface.dropTable('Buses');
  }
};