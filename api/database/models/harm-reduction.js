import sequelize from 'sequelize';
import db from '../db.config.js';
import Client from './client.js';
import { GENDER } from '../enum-constants.js';

const HarmReduction = db.define(
  'harm_reduction',
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
    client_initials: {
      type: sequelize.CHAR(6),
      allowNull: false
    },
    year_of_birth: {
      type: sequelize.INTEGER.UNSIGNED,
      allowNull: true
    },
    gender: {
      type: sequelize.ENUM(...GENDER),
      allowNull: false
    },
    collection_for: {
      type: sequelize.STRING,
      allowNull: false
    },
    kit_type: {
      type: sequelize.STRING(500),
      allowNull: false
    },
    client_id: {
      type: sequelize.UUID,
      defaultValue: null,
      references: {
        model: Client,
        key: 'id'
      }
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

export default HarmReduction;
