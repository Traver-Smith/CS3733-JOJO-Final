import mysql from 'mysql2/promise'; // Using mysql2's promise-based API for cleaner handling

export const handler = async (event) => {
    const dbConfig = {
        host: 'tables4u.clsi6iokwrcx.us-east-2.rds.amazonaws.com',
        user: 'admin',
        password: 'jojosiwa',
        database: 'tablesApp',
    };

    let connection;

    try {
        // Establish the connection using mysql2's promise API
        connection = await mysql.createConnection(dbConfig);

        console.log('Connection established');

        // Query the database
        const [rows] = await connection.query('SELECT * FROM Restaurant');

        console.log('Query successful:', rows);

        // Return the query results
        return {
            statusCode: 200,
            body: JSON.stringify({ data: rows }),
        };
    } catch (err) {
        console.error('Error during query execution:', err.message);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unexpected error occurred', message: err.message }),
        };
    } finally {
        // Close the connection if it was successfully created
        if (connection) {
            try {
                await connection.end();
                console.log('Connection closed');
            } catch (endErr) {
                console.error('Error closing the connection:', endErr.message);
            }
        }
    }
};