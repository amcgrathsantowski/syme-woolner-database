import { config } from 'dotenv';
import sequelize from 'sequelize';
import { QueryLogger } from '../utils/index.js';

let database;

if (!database) {
  config();
  database = new sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      logging: (message) => QueryLogger.info(message)
    }
  );

  if (process.env.NODE_ENV !== 'development') {
    database.sync();
  }
}

export default database;
