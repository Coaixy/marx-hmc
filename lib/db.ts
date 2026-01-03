import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'YOUR_DATABASE_HOST',
  port: 3306,
  user: 'root',
  password: 'YOUR_DATABASE_PASSWORD',
  database: 'study_platform_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

export default pool;

