const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', // replace with your PostgreSQL username
    host: 'localhost',
    database: 'p_MB', // use your actual database name
    password: 'ugotthis', // replace with your PostgreSQL password
    port: 5432, // default PostgreSQL port
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Connection error:', err);
    } else {
        console.log('Connection successful:', res.rows);
    }
    pool.end();
});
