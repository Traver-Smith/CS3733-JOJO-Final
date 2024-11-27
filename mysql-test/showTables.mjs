import mysql from 'mysql2/promise'; // Using mysql2's promise-based API

export const handler = async (event) => {
    const dbConfig = {
        host: 'tables4u.clsi6iokwrcx.us-east-2.rds.amazonaws.com',
        user: 'admin',
        password: 'jojosiwa',
        database: 'tablesApp',
    };

    let connection;

    try {
        // Directly access 'address' from the event when it's provided as a top-level field
        const { address } = event;

        // Validate that address is provided
        if (!address) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing or invalid address parameter' }),
            };
        }

        // Establish the database connection
        connection = await mysql.createConnection(dbConfig);

        console.log('Connection established');

        // Query the database for tables at the specific address
        const query = 'SELECT * FROM Tables WHERE restaurantID = ?'; // Use the correct column name
        const [rows] = await connection.query(query, [address]); // Pass the extracted address

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
        // Close the database connection
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
