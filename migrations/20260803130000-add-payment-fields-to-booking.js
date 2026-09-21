'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Bookings', 'payment_methode', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Bookings', 'paid_amount', {
      type: Sequelize.DECIMAL
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Bookings', 'payment_methode');
    await queryInterface.removeColumn('Bookings', 'paid_amount');
  }
};
