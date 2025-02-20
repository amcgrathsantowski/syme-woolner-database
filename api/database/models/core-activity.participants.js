import sequelize from 'sequelize';
import db from '../db.config.js';
import CoreActivity from './core-activity.js';
import Client from './client.js';

const CoreActivityParticipants = db.define(
  'core_activity_participants',
  {
    core_activity_id: {
      type: sequelize.UUID,
      primaryKey: true,
      references: {
        model: CoreActivity,
        key: 'id'
      }
    },
    client_id: {
      type: sequelize.UUID,
      primaryKey: true,
      references: {
        model: Client,
        key: 'id'
      }
    },
    date_registered: {
      type: sequelize.DATEONLY,
      defaultValue: sequelize.NOW,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

export default CoreActivityParticipants;
