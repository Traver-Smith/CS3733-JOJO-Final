const mysql = require('mysql')

const con = mysql.createConnection({
    host: 'tables4u.clsi6iokwrcx.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'jojosiwa',

})

con.connect((err) => {
    if (err) {
        console.log('Error connecting to Db:', err.message);
        return;
    }
    console.log('Connection established');

    // End the connection after it is established
    con.end((endErr) => {
        if (endErr) {
            console.log('Error ending the connection:', endErr.message);
            return;
        }
        console.log('Connection closed');
    });
});