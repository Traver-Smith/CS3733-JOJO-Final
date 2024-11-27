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

        const address = event.address;
        const restaurantPassword = event.restaurantPassword;

        // Validate that address and restaurantPassword are provided
        if (!address || !restaurantPassword) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input. Address and restaurantPassword are required.' }),
            };
        }

        // Establish the connection using mysql2's promise API
        connection = await mysql.createConnection(dbConfig);

        console.log('Connection established');

        // Query the database to verify the credentials
        const query = `SELECT * FROM Restaurant WHERE address = ? AND restaurantPassword = ?`;
        const [rows] = await connection.execute(query, [address, restaurantPassword]);

        if (rows.length === 1) {
            // Credentials are valid
            const restaurant = rows[0];
            console.log('Login successful:', restaurant);

            // Return success response with restaurant details (excluding sensitive information)
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Login successful',
                    address: restaurant.address,
                    restaurantName: restaurant.restaurantName,
                    // Include other non-sensitive restaurant details as needed
                }),
            };
        } else {
            // Invalid credentials
            console.log('Invalid credentials provided.');

            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid address or password.' }),
            };
        }
    } catch (err) {
        console.error('Error during database operation:', err.message);

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