import mysql from 'mysql2/promise';

export const handler = async (event) => {
    const dbConfig = {
        host: 'tables4u.clsi6iokwrcx.us-east-2.rds.amazonaws.com',
        user: 'admin',
        password: 'jojosiwa',
        database: 'tablesApp',
    };

    let connection;

    try {
        // Log the event object for debugging
        console.log('Received event:', JSON.stringify(event));

        // Extract address directly from the event object
        const { address } = event;

        // Validate that address is provided
        if (!address) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Address is required to update the restaurant status' }),
            };
        }

        // Establish the connection using mysql2's promise API
        connection = await mysql.createConnection(dbConfig);

        console.log('Connection established');

        // Update query to set isActive = 1 for the given address
        const updateQuery = 'UPDATE Restaurant SET isActive = 1 WHERE address = ?';
        const [result] = await connection.query(updateQuery, [address]);

        console.log('Update successful:', result);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No restaurant found with the provided address' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Restaurant status updated successfully' }),
        };
    } catch (err) {
        console.error('Error during update execution:', err.message);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unexpected error occurred', message: err.message }),
        };
    } finally {
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
