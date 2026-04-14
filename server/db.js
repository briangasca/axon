import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

export const pool = mysql2.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS || '',
    database:process.env.DB_NAME
})

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

export const upload = multer({ storage });