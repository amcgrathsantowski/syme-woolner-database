import sequelize from 'sequelize';
import db from '../db.config.js';

const Organization = db.define(
  'organization',
  {
    id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: sequelize.CHAR,
      unique: true,
      allowNull: false
    },
    location: {
      type: sequelize.CHAR,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    underscored: true
  }
);

export default Organization;
