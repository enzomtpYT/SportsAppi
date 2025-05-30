const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST, // Load host from environment variables
    user: process.env.DB_USER, // Load username from environment variables
    password: process.env.DB_PASSWORD, // Load password from environment variables
    database: process.env.DB_NAME, // Load database name from environment variables
    port: process.env.DB_PORT, // Add custom port
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // 10 seconds
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test the connection with retries
const testConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await pool.getConnection();
            console.log('Connected to MariaDB!');
            connection.release();
            
            return true;
        } catch (err) {
            console.error(`Connection to mariaDB attempt ${i + 1} failed:`, err.message);
            if (i < retries - 1) {
                console.log(`Retrying in 5 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
    console.error('Failed to connect to database after', retries, 'attempts');
    return false;
};

// Test connection on startup
testConnection().catch(err => {
    console.error('Error during connection test:', err);
});

module.exports = pool;