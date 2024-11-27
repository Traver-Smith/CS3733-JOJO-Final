import mysql from 'mysql2/promise'; // Using mysql2's promise-based API for cleaner handling

export const handler = async (event) => {
    const dbConfig = {
        host: 'tables4u.clsi6iokwrcx.us-east-2.rds.amazonaws.com',
        user: 'admin',
        password: 'jojosiwa',
        database: 'tablesApp'
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
        const address = event.address

        // Validate the required fields
        if (!restaurantName || !address) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input. restaurantName and address are required.' }),
            };
        }
        
        const hashAddress = (str) => {
            let hash = 5381;
            for (let i = 0; i < str.length; i++) {
                hash = (hash * 33) ^ str.charCodeAt(i); // XOR with character code
            }
            return hash >>> 0; // Ensure the result is non-negative
        };
        
        const restaurantPassword = hashAddress(address).toString();
        
        // Establish the connection using mysql2's promise API
        connection = await mysql.createConnection(dbConfig);

        console.log('Connection established');

        // Insert the new restaurant into the database with default values
        const query = `
            INSERT INTO Restaurant (restaurantName, address, closeTime, openTime, closedDays, isActive, restaurantPassword)
            VALUES (?, ?, 0, 0, 'none', 0, ?)
        `;
        const [result] = await connection.execute(query, [restaurantName, address, restaurantPassword]);

        console.log('Restaurant created successfully:', result);

        // Return success response
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Restaurant created successfully', restaurantId: result.insertId }),
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
