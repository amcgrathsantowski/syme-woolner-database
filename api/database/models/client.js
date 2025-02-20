import sequelize from 'sequelize';
import db from '../db.config.js';
import { GENDER } from '../enum-constants.js';

const Client = db.define(
  'client',
  {
    id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: sequelize.CHAR(50),
      allowNull: false
    },
    last_name: {
      type: sequelize.CHAR(50),
      allowNull: false
    },
    date_of_birth: {
      type: sequelize.DATEONLY,
      allowNull: true
    },
    age: {
      type: sequelize.NUMBER,
      allowNull: true
    },
    gender: {
      type: sequelize.ENUM(...GENDER),
      allowNull: false
    },
    address: {
      type: sequelize.CHAR(100),
      allowNull: true,
      defaultValue: null
    },
    postal_code: {
      type: sequelize.CHAR(6),
      allowNull: true,
      defaultValue: null
    },
    number_of_children: {
      type: sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null
    },
    number_of_adults: {
      type: sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null
    },
    total_family_members: {
      type: sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null
    },
    contact_number: {
      type: sequelize.CHAR(20)
    },
    emergency_contact_number: {
      type: sequelize.CHAR(20)
    },
    emergency_contact_relationship: {
      type: sequelize.CHAR(50)
    },
    date_registered: {
      type: sequelize.DATE()
    }
  },
  {
    freezeTableName: true,
    underscored: true
  }
);

export default Client;
