'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const [existing] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'COURRIER' LIMIT 1;`
    );

    if (existing.length > 0) {
      return;
    }

    await queryInterface.bulkInsert('Roles', [
      {
        name: 'COURRIER',
        description: 'Agent chargé de l’enregistrement, du suivi et de la remise des colis/courriers.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Roles', { name: 'COURRIER' }, {});
  }
};
