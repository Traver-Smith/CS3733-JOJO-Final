const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'tables4u.clsi6iokwrcx.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'jojosiwa',
    database: 'tablesApp',

});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to Db:', err.message);
        return;
    }
    console.log('Connection established');
    con.query('SELECT DATABASE()', (err, results) => {
        if (err) {
            console.error('Error checking active database:', err.message);
        } else {
            console.log('Active database:', results[0]['DATABASE()']);
        }
    });

    con.query('SHOW TABLES', (err, results) => {
        if (err) {
            console.error('Error fetching tables:', err.message);
            con.end();
            return;
        }

        console.log('Tables available in the tablesApp schema:');
        results.forEach((row) => {
            const tableName = Object.values(row)[0]; // Extract table name
            console.log(`- ${tableName}`);
        });

       
    });
    con.end((endErr) => {
        if (endErr) {
            console.error('Error ending the connection:', endErr.message);
            return;
        }
        console.log('Connection closed');
    });
});
 // Close the connection after listing databases
 