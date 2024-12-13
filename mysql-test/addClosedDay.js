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
    const { restaurantClosedID, closedDays } = event;

    // Validate input
    if (!restaurantClosedID || !closedDays) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'restaurantClosedID and closedDays are required.' }),
      };
    }

    // Connect to the database
    connection = await mysql.createConnection(dbConfig);

    // Insert the new closed day into the ClosedDays table
    const query = `
      INSERT INTO ClosedDays (restaurantClosedID, closedDays)
      VALUES (?, ?)
    `;

    const [result] = await connection.execute(query, [restaurantClosedID, closedDays]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Closed day added successfully.', result }),
    };
  } catch (error) {
    console.error('Error adding closed day:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add closed day.', error: error.message }),
    };
  } finally {
    // Ensure the connection is closed
    if (connection) {
      await connection.end();
    }
  }
};
