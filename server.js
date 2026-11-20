const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const db = pool.promise();

app.post('/api/signup', async (req, res) => {
    const { name, email, phone, password, role, gender, jobTitle } = req.body;
    try {
        if (role === 'staff') {
            await db.query(
                'INSERT INTO Staff (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
                [name, email, phone, password, jobTitle]
            );
        } else {
            await db.query(
                'INSERT INTO Customer (name, email, phone, password, gender) VALUES (?, ?, ?, ?, ?)',
                [name, email, phone, password, gender]
            );
        }
        res.json({ message: 'Signup Successful!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const table = role === 'staff' ? 'Staff' : 'Customer';
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ? AND password = ?`, [email, password]);
        
        if (rows.length > 0) {
            const user = rows[0];
            const id = role === 'staff' ? user.staffId : user.customerId;
            const realRole = role === 'staff' ? user.role : 'customer'; 
            
            res.json({ success: true, id: id, name: user.name, role: realRole });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/services', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM Service');
    res.json(rows);
});

app.get('/api/staff', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM Staff WHERE role != 'Manager'");
    res.json(rows);
});

app.post('/api/book', async (req, res) => {
    const { customerId, staffId, serviceId, date, time } = req.body;
    try {
        await db.query(
            'INSERT INTO Appointment (customerId, staffId, serviceId, date, time, status) VALUES (?, ?, ?, ?, ?, ?)',
            [customerId, staffId, serviceId, date, time, 'Booked']
        );
        res.json({ message: 'Booked' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/appointments', async (req, res) => {
    const { staffId, role } = req.query; 

    let query = `
        SELECT a.appointmentId, c.name AS Customer, s.name AS Staff, sv.serviceName, a.date, a.time, a.status 
        FROM Appointment a
        JOIN Customer c ON a.customerId = c.customerId
        JOIN Staff s ON a.staffId = s.staffId
        JOIN Service sv ON a.serviceId = sv.serviceId`;

    if (role !== 'Manager' && staffId) {
        query += ` WHERE a.staffId = ${staffId}`;
    }

    query += ` ORDER BY a.date DESC`;

    try {
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));