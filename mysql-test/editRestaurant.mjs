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
        // Validate and parse the input data
        if (!event) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing request body.' }),
            };
        }

        const restaurantName = event.restaurantName;

        // Validate that restaurantName is provided
        if (!restaurantName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input. restaurantName is required.' }),
            };
        }

        // Initialize arrays for fields to update and corresponding parameters
        const fields = [];
        const params = [];

        // For each optional parameter, check if it's provided and add it to the update
        if (event.closeTime !== undefined) {
            fields.push('closeTime = ?');
            params.push(event.closeTime);
        }

        if (event.openTime !== undefined) {
            fields.push('openTime = ?');
            params.push(event.openTime);
        }

        if (event.closedDays !== undefined) {
            fields.push('closedDays = ?');
            params.push(event.closedDays);
        }

        if (event.isActive !== undefined) {
            fields.push('isActive = ?');
            params.push(event.isActive);
        }

        // Check if there are fields to update
        if (fields.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No fields to update provided.' }),
            };
        }

        // Establish the connection using mysql2's promise API
        connection = await mysql.createConnection(dbConfig);

        console.log('Connection established');

        // Build the UPDATE query dynamically
        const query = `UPDATE Restaurant SET ${fields.join(', ')} WHERE restaurantName = ?`;
        // Add restaurantName to params
        params.push(restaurantName);

        // Execute the UPDATE query
        const [result] = await connection.execute(query, params);

        console.log('Restaurant updated successfully:', result);

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Restaurant updated successfully' }),
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

