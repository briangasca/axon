import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql2.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database:process.env.DB_NAME
})