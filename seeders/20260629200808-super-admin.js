'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {

    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 1. ROLE SUPER_ADMIN
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'SUPER_ADMIN' LIMIT 1;`
    );

    const roleId = roles?.[0]?.id;

    if (!roleId) {
      throw new Error("Role SUPER_ADMIN introuvable");
    }

    // 2. COMPAGNY
    const [companies] = await queryInterface.sequelize.query(
      `SELECT id FROM "Compagnies" LIMIT 1;`
    );

    let compagnyId = companies?.[0]?.id;

    if (!compagnyId) {

      await queryInterface.bulkInsert('Compagnies', [
        {
          name: 'Default Compagnies',
          status: "ACTIVE",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      const [newCompagnies] = await queryInterface.sequelize.query(
        `SELECT id FROM "Compagnies" ORDER BY id DESC LIMIT 1;`
      );

      compagnyId = newCompagnies?.[0]?.id;
    }

    // 3. CHECK USER EXIST
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'admin@busflow.com' LIMIT 1;`
    );

    if (users.length > 0) {
      console.log("SUPER_ADMIN already exists");
      return;
    }

    // 4. CREATE SUPER ADMIN
    await queryInterface.bulkInsert('Users', [{
      first_name: 'Super',
      last_name: 'Admin',
      email: 'admin@busflow.com',
      phone: '00000000',
      password: hashedPassword,
      compagny_id: compagnyId,
      agency_id: null,
      role_id: roleId,
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: 'admin@busflow.com'
    });
  }
};