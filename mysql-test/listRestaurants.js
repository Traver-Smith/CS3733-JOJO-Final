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

    con.query('SELECT * FROM Restaurant', (err, rows)=> {
        if(err) throw err;
        console.log('list of restaurants info');
        console.log(rows);
    });


    con.end((endErr) => {
        if (endErr) {
            console.error('Error ending the connection:', endErr.message);
            return;
        }
        console.log('Connection closed');
    });
});