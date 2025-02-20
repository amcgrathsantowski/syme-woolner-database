import sequelize from 'sequelize';
import db from '../db.config.js';
import { CORE_ACTIVITY } from '../enum-constants.js';

const CoreActivity = db.define(
  'core_activity',
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
      type: sequelize.ENUM(...CORE_ACTIVITY),
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

export default CoreActivity;
