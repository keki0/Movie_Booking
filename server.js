const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'p_MB',
    password: 'ugotthis',
    port: 5432,
});

// API endpoint for fetching theaters
app.get('/api/theaters', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM theaters');
        res.json(result.rows);
    } catch (error) {
        console.error('Database query error:', error.message);
        res.status(500).send('Server error: ' + error.message);
    }
});

// API endpoint for fetching movies
app.get('/api/movies', async (req, res) => {
    const { theaterId, genre } = req.query;
    try {
        const result = await pool.query('SELECT * FROM movies WHERE genre = $1', [genre]);
        res.json(result.rows);
    } catch (error) {
        console.error('Database query error:', error.message);
        res.status(500).send('Server error: ' + error.message);
    }
});

// API endpoint for fetching showtimes
app.get('/api/showtimes', async (req, res) => {
    const { theaterId, movieId } = req.query;
    try {
        const result = await pool.query('SELECT * FROM showtimes WHERE movie_id = $1 AND theater_id = $2', [movieId, theaterId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Database query error:', error.message);
        res.status(500).send('Server error: ' + error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



// API endpoint for user login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.json({ success: false, message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password); // Compare hashed password

        if (match) {
            res.json({ success: true, role: user.role });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).send('Server error: ' + error.message);
    }
});

// Hash passwords in the database for security (run this only once to hash existing passwords)
(async () => {
    const users = await pool.query('SELECT * FROM users');
    for (const user of users.rows) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
    }
})();
