import sequelize from 'sequelize';
import db from '../db.config.js';

const Token = db.define(
  'token',
  {
    token: {
      type: sequelize.STRING(500),
      primaryKey: true
    },
    expires: {
      type: sequelize.DATE,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

export default Token;
