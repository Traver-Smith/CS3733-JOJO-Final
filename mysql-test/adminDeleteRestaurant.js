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
    const { address } = event;

    if (!address) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'address is required' }),
      };
    }

    // Connect to the database
    connection = await mysql.createConnection(dbConfig);

    // Start a transaction
    await connection.beginTransaction();

    // Delete dependent rows in the Reservation table
    await connection.execute(
      'DELETE FROM Reservation WHERE restaurantResID = ?',
      [address]
    );

    // Delete dependent rows in the Tables table
    await connection.execute(
      'DELETE FROM Tables WHERE restaurantID = ?',
      [address]
    );

    // Delete the restaurant
    await connection.execute(
      'DELETE FROM Restaurant WHERE address = ?',
      [address]
    );

    // Commit the transaction
    await connection.commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Restaurant with address ${address} deleted successfully` }),
    };
  } catch (error) {
    if (connection) await connection.rollback();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    if (connection && connection.end) connection.end();
  }
};