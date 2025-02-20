import sequelize from 'sequelize';
import db from '../db.config.js';
import Client from './client.js';
import Activity from './project-activity.js';

const ProjectActivityParticipants = db.define(
  'project_activity_participants',
  {
    project_activity_id: {
      type: sequelize.UUID,
      primaryKey: true,
      references: {
        model: Activity,
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

export default ProjectActivityParticipants;
