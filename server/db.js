import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

export const pool = mysql2.createPool({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD || '',
    database:process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306
})

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

export const upload = multer({ storage });