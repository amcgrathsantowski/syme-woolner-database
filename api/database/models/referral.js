import sequelize from 'sequelize';
import db from '../db.config.js';

const Referral = db.define(
  'referral',
  {
    id: {
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true
    },
    description: {
      type: sequelize.STRING,
      defaultValue: null,
      allowNull: true
    },
    date: {
      type: sequelize.DATEONLY,
      defaultValue: sequelize.NOW,
      allowNull: false
    }, shelter_count: {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, housing_count: {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, mental_health_count: {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, medical_services_count: {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, income_support_count: {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, legal_services_count: {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, settlement_services_count: {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, harm_reduction_services_count : {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, employment_supports_count : {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, food_bank_count : {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, meal_service_count : {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, id_clinic_count : {
      type: sequelize.INTEGER,
      defaultValue: 0
    }, other_count : {
      type: sequelize.INTEGER,
      defaultValue: 0
    },
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

export default Referral;
