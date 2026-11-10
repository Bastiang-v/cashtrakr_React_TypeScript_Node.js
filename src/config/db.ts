import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import dotenv from 'dotenv';
 
dotenv.config();
 
export const db = new Sequelize(process.env.DATABASE_URL, {
  models: [path.join(__dirname, '/../models')],
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: false,
    },
  },
});