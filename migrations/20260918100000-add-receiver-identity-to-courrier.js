'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Courriers', 'receiver_identity_number', { type: Sequelize.STRING, allowNull: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Courriers', 'receiver_identity_number');
  }
};
