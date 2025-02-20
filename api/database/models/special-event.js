import sequelize from 'sequelize';
import db from '../db.config.js';
import { SPECIAL_EVENT } from '../enum-constants.js';

const Event = db.define(
  'special_event',
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
    type: {
      type: sequelize.ENUM(...SPECIAL_EVENT),
      allowNull: false
    },
    number_of_clients: {
      type: sequelize.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

export default Event;
