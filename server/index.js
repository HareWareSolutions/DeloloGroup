import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'delolo-research-group-secret-key-change-in-prod'; // simplistic secret

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database');
        initDb();
    }
});

function initDb() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database schema', err);
        } else {
            seedDb();
        }
    });
}

function seedDb() {
    db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (row && row.count === 0) {
            const hash = bcrypt.hashSync('admin123', 8);
            db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['admin', hash]);
            console.log('Default admin created');
        }
    });
}

// Middleware to authenticate Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// LOGIN ROUTE
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Username and password required');

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).send('Server error');
        if (!user) return res.status(400).send('User not found');

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send('Invalid password');

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({ auth: true, token: token, user: { username: user.username } });
    });
});

// Protected Route Example: Verify Token
app.get('/api/verify-token', authenticateToken, (req, res) => {
    res.status(200).send({ valid: true, user: req.user });
});

// PUBLIC API
app.get('/api/members', (req, res) => {
    db.all("SELECT * FROM members", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.get('/api/publications', (req, res) => {
    db.all("SELECT * FROM publications ORDER BY year DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.get('/api/news', (req, res) => {
    db.all("SELECT * FROM news ORDER BY date DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
