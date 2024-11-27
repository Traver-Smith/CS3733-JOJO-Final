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

        const { tableNum, restaurantID } = event;

        // Validate required fields
        if (!tableNum || !restaurantID) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid input. tableNum and restaurantID are required.',
                }),
            };
        }

        // Establish the database connection
        connection = await mysql.createConnection(dbConfig);
        console.log('Database connection established.');

        // Delete the specified table from the Tables table
        const query = `
            DELETE FROM Tables
            WHERE tableNum = ? AND restaurantID = ?
        `;
        const [result] = await connection.execute(query, [tableNum, restaurantID]);
        console.log('Table deleted successfully:', result);

        // Check if any row was affected
        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'No table found with the specified tableNum and restaurantID.',
                }),
            };
        }

        // Return a success response
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Table deleted successfully',
                affectedRows: result.affectedRows,
            }),
        };
    } catch (error) {
        console.error('Error deleting table:', error.message);

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
