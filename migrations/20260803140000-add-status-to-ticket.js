'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tickets', 'status', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Tickets', 'scanned_at', {
      type: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tickets', 'status');
    await queryInterface.removeColumn('Tickets', 'scanned_at');
  }
};
