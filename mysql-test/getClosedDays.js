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
    const { restaurantAddress } = event;

    // Validate input
    if (!restaurantAddress) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'restaurantAddress is required.' }),
      };
    }

    // Connect to the database
    connection = await mysql.createConnection(dbConfig);

    // Query for closed days of the specified restaurant
    const query = `
      SELECT closedDays
      FROM ClosedDays
      WHERE restaurantClosedID = ?
    `;

    const [rows] = await connection.execute(query, [restaurantAddress]);

    // Return the list of closed days
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Closed days fetched successfully.',
        closedDays: rows,
      }),
    };
  } catch (error) {
    console.error('Error fetching closed days:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch closed days.', error: error.message }),
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
