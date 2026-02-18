CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
);

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  role_pt TEXT,
  role_en TEXT,
  bio_pt TEXT,
  bio_en TEXT,
  image_url TEXT,
  type TEXT CHECK(type IN ('current', 'alumni', 'pi')) DEFAULT 'current',
  order_index INTEGER DEFAULT 0,
  lattes TEXT,
  linkedin TEXT,
  orcid TEXT,
  google_scholar TEXT,
  current_workplace TEXT,
  supervision_type TEXT DEFAULT 'advisor'
);

CREATE TABLE IF NOT EXISTS publications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_pt TEXT,
  title_en TEXT,
  journal TEXT,
  year INTEGER,
  doi TEXT,
  authors TEXT,
  image_url TEXT,
  volume TEXT,
  pages TEXT,
  pub_type TEXT,
  deposit_date TEXT,
  grant_date TEXT
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_pt TEXT,
  title_en TEXT,
  content_pt TEXT,
  content_en TEXT,
  date TEXT,
  image_url TEXT,
  category TEXT,
  status TEXT DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  content_pt TEXT,
  content_en TEXT
);

CREATE TABLE IF NOT EXISTS candidatos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  position TEXT,
  message TEXT,
  date TEXT,
  cv_url TEXT
);

CREATE TABLE IF NOT EXISTS lectures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year TEXT,
  institution TEXT,
  country_pt TEXT,
  country_en TEXT,
  title_pt TEXT,
  title_en TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
