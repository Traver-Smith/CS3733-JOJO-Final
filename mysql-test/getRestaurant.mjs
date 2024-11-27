import mysql from 'mysql2/promise'; // Using mysql2's promise-based API for database operations

export const handler = async (event) => {
    const dbConfig = {
        host: 'tables4u.clsi6iokwrcx.us-east-2.rds.amazonaws.com',
        user: 'admin',
        password: 'jojosiwa',
        database: 'tablesApp',
    };

    let connection;

    try {
        // Validate and parse the input data
        if (!event) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing request body.' }),
            };
        }

        const { address } = event;

        // Validate required fields
        if (!address) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input. address is required.' }),
            };
        }

        // Establish the database connection
        connection = await mysql.createConnection(dbConfig);
        console.log('Database connection established.');

        // Query the database for the restaurant details
        const query = `
            SELECT * FROM Restaurant
            WHERE address = ?
        `;
        const [restaurant] = await connection.execute(query, [address]);

        // Check if restaurant exists
        if (restaurant.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Restaurant not found.' }),
            };
        }

        // Return the restaurant details
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Restaurant retrieved successfully',
                restaurant: restaurant[0],
            }),
        };
    } catch (error) {
        console.error('Error retrieving restaurant:', error.message);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Unexpected error occurred',
                message: error.message,
            }),
        };
    } finally {
        if (connection) {
            try {
                await connection.end();
                console.log('Database connection closed.');
            } catch (endErr) {
                console.error('Error closing connection:', endErr.message);
            }
        }
    }
};
