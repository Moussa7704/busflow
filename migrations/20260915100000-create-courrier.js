'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courriers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      compagny_id: {
        type: Sequelize.INTEGER
      },
      tracking_number: {
        type: Sequelize.STRING,
        unique: true
      },
      sender_name: {
        type: Sequelize.STRING
      },
      sender_phone: {
        type: Sequelize.STRING
      },
      receiver_name: {
        type: Sequelize.STRING
      },
      receiver_phone: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.DECIMAL
      },
      departure_agency_id: {
        type: Sequelize.INTEGER
      },
      arrival_agency_id: {
        type: Sequelize.INTEGER
      },
      trip_id: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      paid_amount: {
        type: Sequelize.DECIMAL
      },
      payment_method: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM(
          "REGISTERED",
          "IN_TRANSIT",
          "ARRIVED",
          "DELIVERED",
          "CANCELLED"
        ),
        defaultValue: "REGISTERED"
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      received_by: {
        type: Sequelize.INTEGER
      },
      delivered_by: {
        type: Sequelize.INTEGER
      },
      registered_at: {
        type: Sequelize.DATE
      },
      arrived_at: {
        type: Sequelize.DATE
      },
      delivered_at: {
        type: Sequelize.DATE
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
  async down(queryInterface) {
    await queryInterface.dropTable('Courriers');
  }
};
