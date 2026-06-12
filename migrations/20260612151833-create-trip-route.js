'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TripRoutes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      compagny_id: {
        type: Sequelize.INTEGER
      },
      departure_city: {
        type: Sequelize.STRING
      },
      arrival_city: {
        type: Sequelize.STRING
      },
      distance_km: {
        type: Sequelize.FLOAT
      },
      estimated_duration: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('TripRoutes');
  }
};