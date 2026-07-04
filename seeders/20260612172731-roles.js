'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Roles', [
      {
        name: 'SUPER_ADMIN',
        description: 'Administrateur global de la plateforme. Accès complet à toutes les compagnies, agences, utilisateurs et paramètres.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'COMPAGNY_ADMIN',
        description: 'Administrateur d’une compagnie. Gère uniquement les agences, utilisateurs et opérations de sa compagnie.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'AGENCY_ADMIN',
        description: 'Administrateur d’une agence. Gère les utilisateurs et les opérations de son agence uniquement.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'AGENT',
        description: 'Agent chargé de la vente, de la réservation et de la gestion des passagers.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'CONTROLLER',
        description: 'Contrôleur chargé de vérifier les billets, les passagers et les départs.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'DRIVER',
        description: 'Conducteur affecté aux trajets et aux véhicules de la compagnie.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};