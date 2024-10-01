// Import required modules
const express = require('express');
const mysql = require('mysql2'); // Use the correct MySQL client

// Create an Express app
const app = express();

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your database username
    password: 'PASSWWORD', // Replace with your database password
    database: 'hospital_db'  // Replace with your database name
});

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// 1. Retrieve all patients
// GET endpoint to retrieve all patients with specified columns
app.get('/all-patients', (req, res) => {
    // SQL query to retrieve the required patient data
    const query = `SELECT patient_id, first_name, last_name, date_of_birth FROM patients`;

    // Execute the query
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching patients:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results);
    });
});

// 2. Retrieve all providers
// GET endpoint to retrieve all providers with first_name, last_name, and specialty
app.get('/all-providers', (req, res) => {
    // SQL query to retrieve provider details
    const query = `SELECT first_name, last_name, specialty FROM providers`;

    // Execute the query
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching providers:', err);
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results);
    });
});

// 3. Filter patients by First Name
// Create the GET endpoint to retrieve patients by their first name
app.get('/patients/by-first-name', (req, res) => {
    const firstName = req.query.first_name;  // Get the 'first_name' query parameter

    if (!firstName) {
        return res.status(400).json({ error: 'Please provide a first name.' });
    }

    // SQL query to retrieve patients by their first name
    const query = 'SELECT * FROM patients WHERE first_name = ?';

    // Execute the query
    connection.query(query, [firstName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving patients' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: `No patients found with first name: ${firstName}` });
        }

        // Return the retrieved patients
        res.status(200).json(results);
    });
});

// 4. Retrieve providers by their specialty
// GET endpoint to retrieve providers by their specialty
app.get('/providers/by-specialty', (req, res) => {
    const specialty = req.query.specialty;  // Get the 'specialty' query parameter

    if (!specialty) {
        return res.status(400).json({ error: 'Please provide a specialty.' });
    }

    // SQL query to retrieve providers by their specialty
    const query = 'SELECT * FROM providers WHERE specialty = ?';

    // Execute the query
    connection.query(query, [specialty], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving providers' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: `No providers found with specialty: ${specialty}` });
        }

        // Return the retrieved providers
        res.status(200).json(results);
    });
});

// Start the server
const PORT = process.env.PORT || 3400;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// WE USE THE FOLLOWING LINKS TO ACCESS EACH OF OUR RETREIVALS FROM MYSQL

// 1. http://localhost:3400/all-patients
// 2. http://localhost:3400/all-providers
// 3. http://localhost:3400/patients/by-first-name?first_name=DESIRED NAME GOES HERE
// 4. http://localhost:3400/providers/by-specialty?specialty=DESIRED SPECIALTY GOES HERE
