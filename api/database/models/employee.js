import sequelize from 'sequelize';
import db from '../db.config.js';
import { USER_ROLES } from '../enum-constants.js';
import Organization from './organization.js';

const Employee = db.define(
  'employee',
  {
    id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    first_name: {
      type: sequelize.CHAR(50),
      allowNull: false
    },
    last_name: {
      type: sequelize.CHAR(50),
      allowNull: false
    },
    username: {
      type: sequelize.CHAR(50),
      unique: true,
      allowNull: false
    },
    email: {
      type: sequelize.CHAR(100),
      unique: true,
      allowNull: false
    },
    password: {
      type: sequelize.CHAR(76),
      allowNull: false
    },
    role: {
      type: sequelize.ENUM(...USER_ROLES),
      allowNull: false,
      defaultValue: 'Employee'
    },
    org: {
      type: sequelize.UUID,
      allowNull: true,
      references: {
        model: Organization,
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true,
    underscored: true
  }
);

export default Employee;
