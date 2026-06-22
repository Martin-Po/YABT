require('dotenv').config();

const fs = require('fs');

function safeRead(path) {
    try {
        return fs.readFileSync(path, 'utf8').trim();
    } catch (err) {
        return undefined;
    }
}

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = safeRead('/run/secrets/db_user');
const DB_PASSWORD = safeRead('/run/secrets/db_password');
const DB_NAME = safeRead('/run/secrets/db_name');

const TOKEN_SECRET = safeRead('/run/secrets/token_secret');


module.exports = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    TOKEN_SECRET,
};