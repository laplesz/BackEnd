require('dotenv').config();

const config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'investments3',
        port: Number(process.env.DB_PORT) || 3306,
        connectTimeout: 60000,
    },
    listPerPage: 10,
};
module.exports = config;
