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
  type TEXT CHECK(type IN ('current', 'alumni', 'pi'))
);

CREATE TABLE IF NOT EXISTS publications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  journal TEXT,
  year INTEGER,
  doi TEXT,
  authors TEXT
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_pt TEXT,
  title_en TEXT,
  content_pt TEXT,
  content_en TEXT,
  date TEXT,
  image_url TEXT
);
