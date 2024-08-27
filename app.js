const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'build')));
app.use('/images', express.static(path.join(__dirname, 'src', 'images')));

const PORT = process.env.PORT || 8080;

// MySQL connection setup
//TODO: replace with your MySQL credentials
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS
});

connection.connect(function (err) {
    if (err) {
        console.error("Failed to connect to MySQL: ", err);
        return;
    }
    console.log("Connected to MySQL");
});

// Endpoint to fetch data from MySQL database
//TODO: replace with your MySQL query
app.get('/api', (req, res) => {
    // Add your MySQL query logic here
    const {  } = req.query;

    // TODO: replace with your MySQL query
    let query = 'SELECT * FROM your_table';
    const queryParams = [];

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error("Error executing MySQL query: ", error);
            res.status(500).json({ error: "Error executing MySQL query" });
            return;
        }
        res.json(results);
    });
});


// Catch-all handler to serve React app for unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
