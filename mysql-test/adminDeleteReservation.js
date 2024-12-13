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
    // Parse the input from the event body
    const { reservationID } = event;

    // Validate input
    if (!reservationID) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'reservationID is required.' }),
      };
    }

    // Connect to the database
    connection = await mysql.createConnection(dbConfig);

    // Delete the reservation
    const deleteQuery = `
      DELETE FROM Reservation 
      WHERE reservationID = ?
    `;
    const [result] = await connection.execute(deleteQuery, [reservationID]);

    // Check if a row was deleted
    if (result.affectedRows === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No matching reservation found to delete.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Reservation deleted successfully.' }),
    };
  } catch (error) {
    console.error('Error deleting reservation:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete reservation.', error: error.message }),
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
