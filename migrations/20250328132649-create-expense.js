'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      expenseid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(11),
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      uangmasuk: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00,
      },
      uangkeluar: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00,
      },
      uangakhir: {
        allowNull: false,
        type: Sequelize.DECIMAL(15, 2),
      },
      description: {
        type: Sequelize.TEXT,
      },
      transaction_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Expenses');
  },
};