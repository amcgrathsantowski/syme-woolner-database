import sequelize from 'sequelize';
import db from '../db.config.js';
import { MEAL_TYPE } from '../enum-constants.js';

const Meal = db.define(
  'meal',
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
      type: sequelize.ENUM(...MEAL_TYPE),
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

export default Meal;
