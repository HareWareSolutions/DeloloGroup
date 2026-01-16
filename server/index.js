import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'delolo-research-group-secret-key-change-in-prod';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
            fs.mkdirSync(path.join(__dirname, 'uploads'));
        }
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        // Sanitize filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'));
    }
});

const upload = multer({ storage: storage });

// Database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error opening database', err);
    else {
        console.log('Connected to SQLite database');
        initDb();
    }
});

function initDb() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) console.error('Error initializing schema', err);
        else seedDb();
    });
}

function seedDb() {
    db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (row && row.count === 0) {
            const hash = bcrypt.hashSync('admin123', 8);
            db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['admin', hash]);
        }
    });

    // Seed initial content if empty
    const initialContent = [
        { key: 'hero_title', pt: 'Avançando a Química para um Futuro Sustentável', en: 'Advancing Chemistry for a Sustainable Future' },
        { key: 'hero_subtitle', pt: 'Foco em catálise e química verde.', en: 'Delolo Research Group focuses on catalysis...' }
    ];

    initialContent.forEach(item => {
        db.run("INSERT OR IGNORE INTO site_content (key, content_pt, content_en) VALUES (?, ?, ?)", [item.key, item.pt, item.en]);
    });
}

// Middleware
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

// --- AUTH ROUTES ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Username and password required');

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).send('Server error');
        if (!user) return res.status(400).send('User not found');

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send('Invalid password');

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: 86400 });
        res.status(200).send({ auth: true, token: token, user: { username: user.username } });
    });
});

// --- MEDIA ROUTES ---
// Upload single image
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    // Return the full URL or relative path
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// List images
app.get('/api/media', authenticateToken, (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');
    fs.readdir(directoryPath, (err, files) => {
        if (err) return res.status(500).send('Unable to scan directory: ' + err);
        // Filter for image extensions if needed
        const fileUrls = files.map(file => ({
            name: file,
            url: `/uploads/${file}`
        }));
        res.json(fileUrls);
    });
});

// --- PUBLICATIONS ROUTES ---
app.get('/api/publications', (req, res) => {
    db.all("SELECT * FROM publications ORDER BY year DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/publications', authenticateToken, (req, res) => {
    const { title, journal, year, doi, authors, image_url, volume, pages, pub_type } = req.body;
    db.run(`INSERT INTO publications (title, journal, year, doi, authors, image_url, volume, pages, pub_type) VALUES (?,?,?,?,?,?,?,?,?)`,
        [title, journal, year, doi, authors, image_url, volume, pages, pub_type],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.put('/api/publications/:id', authenticateToken, (req, res) => {
    const { title, journal, year, doi, authors, image_url, volume, pages, pub_type } = req.body;
    db.run(`UPDATE publications SET title=?, journal=?, year=?, doi=?, authors=?, image_url=?, volume=?, pages=?, pub_type=? WHERE id=?`,
        [title, journal, year, doi, authors, image_url, volume, pages, pub_type, req.params.id],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ changes: this.changes });
        }
    );
});

app.delete('/api/publications/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM publications WHERE id=?`, [req.params.id], function (err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ changes: this.changes });
    });
});

// --- NEWS ROUTES ---
app.get('/api/news', (req, res) => {
    db.all("SELECT * FROM news ORDER BY date DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/news', authenticateToken, (req, res) => {
    const { title_pt, title_en, content_pt, content_en, date, image_url, category, status } = req.body;
    db.run(`INSERT INTO news (title_pt, title_en, content_pt, content_en, date, image_url, category, status) VALUES (?,?,?,?,?,?,?,?)`,
        [title_pt, title_en, content_pt, content_en, date, image_url, category, status],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.put('/api/news/:id', authenticateToken, (req, res) => {
    const { title_pt, title_en, content_pt, content_en, date, image_url, category, status } = req.body;
    db.run(`UPDATE news SET title_pt=?, title_en=?, content_pt=?, content_en=?, date=?, image_url=?, category=?, status=? WHERE id=?`,
        [title_pt, title_en, content_pt, content_en, date, image_url, category, status, req.params.id],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ changes: this.changes });
        }
    );
});

app.delete('/api/news/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM news WHERE id=?`, [req.params.id], function (err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ changes: this.changes });
    });
});

// --- CONTENT ROUTES ---
app.get('/api/content', (req, res) => {
    db.all("SELECT * FROM site_content", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/content', authenticateToken, (req, res) => {
    const { key, content_pt, content_en } = req.body;
    db.run(`INSERT INTO site_content (key, content_pt, content_en) 
          VALUES (?, ?, ?) 
          ON CONFLICT(key) DO UPDATE SET content_pt=excluded.content_pt, content_en=excluded.content_en`,
        [key, content_pt, content_en],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ message: 'Content updated', changes: this.changes });
        }
    );
});

// --- MEMBERS ROUTES ---
app.get('/api/members', (req, res) => {
    db.all("SELECT * FROM members ORDER BY order_index ASC, id ASC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/members', authenticateToken, (req, res) => {
    const { name, role_pt, role_en, bio_pt, bio_en, image_url, type, lattes, linkedin, orcid, google_scholar, current_workplace } = req.body;
    db.run(`INSERT INTO members (name, role_pt, role_en, bio_pt, bio_en, image_url, type, lattes, linkedin, orcid, google_scholar, current_workplace) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [name, role_pt, role_en, bio_pt, bio_en, image_url, type, lattes, linkedin, orcid, google_scholar, current_workplace],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.put('/api/members/:id', authenticateToken, (req, res) => {
    const { name, role_pt, role_en, bio_pt, bio_en, image_url, type, lattes, linkedin, orcid, google_scholar, current_workplace } = req.body;
    db.run(`UPDATE members SET name=?, role_pt=?, role_en=?, bio_pt=?, bio_en=?, image_url=?, type=?, lattes=?, linkedin=?, orcid=?, google_scholar=?, current_workplace=? WHERE id=?`,
        [name, role_pt, role_en, bio_pt, bio_en, image_url, type, lattes, linkedin, orcid, google_scholar, current_workplace, req.params.id],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ changes: this.changes });
        }
    );
});

app.delete('/api/members/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM members WHERE id=?`, [req.params.id], function (err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
