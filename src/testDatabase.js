const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST, // Load host from environment variables
    user: process.env.DB_USER, // Load username from environment variables
    password: process.env.DB_PASSWORD, // Load password from environment variables
    database: process.env.DB_NAME, // Load database name from environment variables
    port: process.env.DB_PORT, // Add custom port
    connectTimeout: 10000 // 10 second timeout
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MariaDB:', err.message);
        console.error('Error code:', err.code);
        console.error('Error stack:', err.stack);
        return;
    }
    console.log('Connected to MariaDB!');

    // Test query
    connection.query('SELECT 1 + 1 AS result', (err, results) => {
        if (err) {
            console.error('Error executing test query:', err.message);
            connection.end();
            return;
        }
        console.log('Test query result:', results[0].result);
        connection.end(); // Close the connection after query is complete
    });
});
