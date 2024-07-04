import mysql from 'mysql2/promise';

let db: mysql.Connection;
async function connectDB(){
    db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
      });
};
connectDB();
export { db };