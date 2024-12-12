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
        // Parse restaurantID and date from the event body
        const { restaurantResID, reserveDate } = event; 

        if (!restaurantResID || !reserveDate) {
            throw new Error('Missing required parameters: restaurantResID and reserveDate');
        }

        // Establish the connection
        connection = await mysql.createConnection(dbConfig);

        console.log('Connection established');

        // Query the restaurant's open and close times
        const restaurantQuery = `
            SELECT openTime, closeTime FROM tablesApp.Restaurant WHERE address = ?
        `;
        const [restaurantRows] = await connection.query(restaurantQuery, [restaurantResID]);

        if (restaurantRows.length === 0) {
            throw new Error('Restaurant not found');
        }

        const { openTime, closeTime } = restaurantRows[0];

        // Generate hours array
        const hours = [];
        let currentHour = new Date(`${reserveDate}T${openTime}`);
        const closingHour = new Date(`${reserveDate}T${closeTime}`);

        while (currentHour < closingHour) {
            hours.push(currentHour.toISOString().substring(0, 13) + ':00:00'); // Format to hourly
            currentHour.setHours(currentHour.getHours() + 1);
        }

        // Query reservations for the specified date
        const reservationQuery = `
            SELECT * FROM tablesApp.Reservation WHERE restaurantResID = ? AND reserveDate = ?
        `;
        const [reservationRows] = await connection.query(reservationQuery, [restaurantResID, reserveDate]);

        // Map reservations by hour
        const reservationsByHour = reservationRows.reduce((acc, reservation) => {
            const reservationHour = new Date(`${reserveDate}T${reservation.reserveTime}`).toISOString().substring(0, 13) + ':00:00';
            acc[reservationHour] = reservation;
            return acc;
        }, {});

        // Check if reservationsByHour is empty
        

        // Build response for each hour
        const result = hours.map((hour) => {
            if (reservationsByHour[hour]) {
                return { ...reservationsByHour[hour], hasReservation: true };
            } else {
                return {
                    hour,
                    hasReservation: false,
                    message: 'No reservation for this hour',
                };
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ data: result }),
        };
    } catch (err) {
        console.error('Error during query execution:', err.message);

        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Unexpected error occurred', message: err.message }),
        };
    } finally {
        // Close the connection
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
