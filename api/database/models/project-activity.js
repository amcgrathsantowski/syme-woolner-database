import sequelize from 'sequelize';
import db from '../db.config.js';
import { PROJECT_ACTIVITY } from '../enum-constants.js';

const Activity = db.define(
  'project_activity',
  {
    id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true
    },
    date: {
      type: sequelize.DATEONLY,
      defaultValue: sequelize.NOW,
      allowNull: false
    },
    number_of_clients: {
      type: sequelize.INTEGER.UNSIGNED,
      defaultValue: 0,
      allowNull: false
    },
    type: {
      type: sequelize.ENUM(...PROJECT_ACTIVITY),
      allowNull: false
    },
    description: {
      type: sequelize.CHAR,
      defaultValue: null,
      allowNull: true
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

export default Activity;
