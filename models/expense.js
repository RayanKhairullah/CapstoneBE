'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  Expense.init(
    {
      expenseid: {
        type: DataTypes.STRING(11),
        primaryKey: true,
      },
      category: DataTypes.STRING,
      uangmasuk: DataTypes.DECIMAL(15, 2),
      uangkeluar: DataTypes.DECIMAL(15, 2),
      uangakhir: DataTypes.DECIMAL(15, 2),
      description: DataTypes.TEXT,
      transaction_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Expense',
    }
  );
  return Expense;
};