'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'SUPER_ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'COMPANY_ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'AGENT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'CONTROLLER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'DRIVER',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete('Roles', null, {});
  }
};
