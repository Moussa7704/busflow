'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const [existing] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'CAISSIER' LIMIT 1;`
    );

    if (existing.length > 0) {
      return;
    }

    await queryInterface.bulkInsert('Roles', [
      {
        name: 'CAISSIER',
        description: 'Caissier chargé de l’encaissement et du suivi des paiements.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Roles', { name: 'CAISSIER' }, {});
  }
};
