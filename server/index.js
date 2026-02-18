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
        else {
            // Migrations: Add new columns if they don't exist
            // SQLite doesn't have IF NOT EXISTS for columns, so we try and ignore errors
            db.run("ALTER TABLE publications ADD COLUMN deposit_date TEXT", (err) => { });
            db.run("ALTER TABLE publications ADD COLUMN grant_date TEXT", (err) => { });

            // Lectures migrations
            db.run("ALTER TABLE lectures ADD COLUMN title_pt TEXT", (err) => { });
            db.run("ALTER TABLE lectures ADD COLUMN title_en TEXT", (err) => { });
            db.run("ALTER TABLE lectures ADD COLUMN country_pt TEXT", (err) => { });
            db.run("ALTER TABLE lectures ADD COLUMN country_en TEXT", (err) => { });

            seedDb();
        }
    });
}

function seedDb() {
    // Users
    const targetUser = 'fabiodelolo@hotmail.com';
    const targetPass = 'Fabio@2026@DRG';

    db.get("SELECT * FROM users WHERE username = ?", [targetUser], (err, row) => {
        const hash = bcrypt.hashSync(targetPass, 8);
        if (!row) {
            db.run("INSERT INTO users (username, password) VALUES (?, ?)", [targetUser, hash]);
            console.log("Created target admin user");
        } else {
            db.run("UPDATE users SET password = ? WHERE username = ?", [hash, targetUser]);
            console.log("Updated target admin user password");
        }
    });

    db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (row && row.count === 0) {
            // Keep default admin just in case, or we can skip it since we added the one above
            const hash = bcrypt.hashSync('admin123', 8);
            db.run("INSERT OR OPTIONAL INTO users (username, password) VALUES (?, ?)", ['admin', hash], (err) => {
                // Ignore error if admin already exists or conflict
            });
        }
    });

    // Members
    db.get("SELECT count(*) as count FROM members", (err, row) => {
        if (row && row.count === 0) {
            const bioPt = `Doutor em Ciências - Química (2022) e Mestre em Química Inorgânica (2018) pela UFMG, Bacharel em Química (2016) pela UFSCar. MBA em Gestão de Negócios pela USP-ESALQ (2020). Experiência em catálise, química verde e eletroquímica. Foi bolsista CAPES CsF na University of Glasgow e CAPES-PrInt no LIKAT (Alemanha), supervisionado por Matthias Beller. Recebeu diversos prêmios, incluindo Prêmio CAPES de Teses (2023) e CAS Future Leaders (2025). Membro afiliado da ABC para o Lindau Nobel Laureate Meeting. Atualmente pesquisador CAPES-PIPD na UFMG explora valorização de biomassa.`;
            const bioEn = `Ph.D. in Chemistry (2022) and Master in Inorganic Chemistry (2018) from UFMG. MBA in Business Management from USP-ESALQ. Experience in catalysis, green chemistry, and electrochemistry. Former CAPES fellow at University of Glasgow and LIKAT (Germany). Recipient of multiple awards including CAPES Thesis Award (2023) and CAS Future Leaders (2025). Selected for Lindau Nobel Laureate Meeting. Currently CAPES-PIPD researcher at UFMG exploring biomass valorization.`;

            db.run(`INSERT INTO members (name, role_pt, role_en, type, image_url, bio_pt, bio_en) VALUES 
                ('Fábio G. Delolo', 'Pesquisador Principal', 'Principal Investigator', 'pi', '/uploads/fabio.jpg', ?, ?),
                ('Novo Membro', 'Pesquisador', 'Researcher', 'current', '', 'Integrante da equipe.', 'Team member.')
            `, [bioPt, bioEn]);
            console.log("Seeded members");
        }
    });

    // Publications
    db.get("SELECT count(*) as count FROM publications", (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO publications (title_pt, title_en, journal, year, authors, volume, pages, pub_type) VALUES 
                ('Acoplamento Cruzado Desoxigenativo C(sp3)-N(sp3) Ativado por Catálise Metalofotoredox de Níquel', 'Deoxygenative C(sp3)-N(sp3) Cross-Coupling Enabled by Nickel Metallaphotoredox Catalysis', 'J. Am. Chem. Soc.', 2025, 'R. Chen, T. Kim, N. B. Bissonnette, R. T. Martin, J. R. Martinelli, A. Cabré, D. W. C. MacMillan', '147', '37855-37892', 'Article')
            `);
            console.log("Seeded publications");
        }
    });

    // News
    db.get("SELECT count(*) as count FROM news", (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO news (title_pt, title_en, content_pt, content_en, date, status, category) VALUES 
                ('Novo site lançado', 'New website launched', 'Temos o prazer de anunciar nosso novo site.', 'We are pleased to announce our new website.', '${new Date().toISOString()}', 'published', 'Congresso/Evento')
            `);
            console.log("Seeded news");
        }
    });

    // Site Content
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

    if (token == null) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (!user) return res.status(401).json({ message: 'Invalid username or password' });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: 86400 });
        res.status(200).json({ auth: true, token: token, user: { username: user.username } });
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
    const { title_pt, title_en, journal, year, doi, authors, image_url, volume, pages, pub_type, deposit_date, grant_date } = req.body;
    db.run(`INSERT INTO publications (title_pt, title_en, journal, year, doi, authors, image_url, volume, pages, pub_type, deposit_date, grant_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [title_pt, title_en, journal, year, doi, authors, image_url, volume, pages, pub_type, deposit_date, grant_date],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.put('/api/publications/:id', authenticateToken, (req, res) => {
    const { title_pt, title_en, journal, year, doi, authors, image_url, volume, pages, pub_type, deposit_date, grant_date } = req.body;
    db.run(`UPDATE publications SET title_pt=?, title_en=?, journal=?, year=?, doi=?, authors=?, image_url=?, volume=?, pages=?, pub_type=?, deposit_date=?, grant_date=? WHERE id=?`,
        [title_pt, title_en, journal, year, doi, authors, image_url, volume, pages, pub_type, deposit_date, grant_date, req.params.id],
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


app.get('/api/news/:id', (req, res) => {
    db.get("SELECT * FROM news WHERE id = ?", [req.params.id], (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        else if (!row) res.status(404).json({ error: 'News not found' });
        else res.json(row);
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


app.get('/api/members/:id', (req, res) => {
    db.get("SELECT * FROM members WHERE id = ?", [req.params.id], (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        else if (!row) res.status(404).json({ error: 'Member not found' });
        else res.json(row);
    });
});

app.post('/api/members', authenticateToken, (req, res) => {
    const { name, role_pt, role_en, bio_pt, bio_en, image_url, type, lattes, linkedin, orcid, google_scholar, current_workplace, supervision_type } = req.body;
    db.run(`INSERT INTO members (name, role_pt, role_en, bio_pt, bio_en, image_url, type, lattes, linkedin, orcid, google_scholar, current_workplace, supervision_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [name, role_pt, role_en, bio_pt, bio_en, image_url, type, lattes, linkedin, orcid, google_scholar, current_workplace, supervision_type || 'advisor'],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.put('/api/members/:id', authenticateToken, (req, res) => {
    const { name, role_pt, role_en, bio_pt, bio_en, image_url, type, lattes, linkedin, orcid, google_scholar, current_workplace, supervision_type } = req.body;
    db.run(`UPDATE members SET name=?, role_pt=?, role_en=?, bio_pt=?, bio_en=?, image_url=?, type=?, lattes=?, linkedin=?, orcid=?, google_scholar=?, current_workplace=?, supervision_type=? WHERE id=?`,
        [name, role_pt, role_en, bio_pt, bio_en, image_url, type, lattes, linkedin, orcid, google_scholar, current_workplace, supervision_type || 'advisor', req.params.id],
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

// --- CANDIDATES ROUTES ---
app.get('/api/candidates', authenticateToken, (req, res) => {
    db.all("SELECT * FROM candidatos ORDER BY date DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/candidates', (req, res) => {
    const { name, email, position, message } = req.body;
    const date = new Date().toISOString();
    db.run(`INSERT INTO candidatos (name, email, position, message, date) VALUES (?, ?, ?, ?, ?)`,
        [name, email, position, message, date],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.delete('/api/candidates/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM candidatos WHERE id=?`, [req.params.id], function (err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ changes: this.changes });
    });
});

// --- LECTURES ROUTES ---
app.get('/api/lectures', (req, res) => {
    db.all("SELECT * FROM lectures ORDER BY year DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/lectures', authenticateToken, (req, res) => {
    // Determine if old or new format is sent. New format uses _pt/_en suffixes.
    // If user sends 'title', we map it to 'title_pt' as default or handle accordingly.
    const { year, institution, country_pt, country_en, title_pt, title_en } = req.body;

    db.run(`INSERT INTO lectures (year, institution, country_pt, country_en, title_pt, title_en) VALUES (?, ?, ?, ?, ?, ?)`,
        [year, institution, country_pt, country_en, title_pt, title_en],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.put('/api/lectures/:id', authenticateToken, (req, res) => {
    const { year, institution, country_pt, country_en, title_pt, title_en } = req.body;
    db.run(`UPDATE lectures SET year=?, institution=?, country_pt=?, country_en=?, title_pt=?, title_en=? WHERE id=?`,
        [year, institution, country_pt, country_en, title_pt, title_en, req.params.id],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ changes: this.changes });
        }
    );
});

app.delete('/api/lectures/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM lectures WHERE id=?`, [req.params.id], function (err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
