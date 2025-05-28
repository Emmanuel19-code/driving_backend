// ./config/db.js
import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import 'dotenv/config.js';

const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST
} = process.env;

const initializeDatabase = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
  });
  return sequelize;
};

export default initializeDatabase;
