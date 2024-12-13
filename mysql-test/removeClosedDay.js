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
    
    // Ensure event.body is defined
    if (!event) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Request body is required.' }),
      };
    }

    // Parse the input from the event body
    const { restaurantClosedID, closedDate } = event;

    // Validate input
    if (!restaurantClosedID || !closedDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'restaurantClosedID and closedDate are required.' }),
      };
    }

    // Connect to the database
    connection = await mysql.createConnection(dbConfig);

    // Delete the closed day
    const deleteQuery = `
      DELETE FROM ClosedDays 
      WHERE restaurantClosedID = ? AND closedDays = ?
    `;
    const [result] = await connection.execute(deleteQuery, [restaurantClosedID, closedDate]);

    // Check if a row was deleted
    if (result.affectedRows === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No matching record found to delete.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Closed day removed successfully.' }),
    };
  } catch (error) {
    console.error('Error removing closed day:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to remove closed day.', error: error.message }),
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
