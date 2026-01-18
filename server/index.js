import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Initialize SQLite Database
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new Database(path.join(dbDir, 'database.sqlite'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    logo TEXT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    logo TEXT,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT,
    year TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

// Create default admin user if not exists
try {
  const adminExists = db.prepare('SELECT * FROM admin WHERE username = ?').get('admin');
  if (!adminExists) {
    console.log('Creating default admin user...');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run('admin', hashedPassword);
    console.log('Default admin user created: admin / admin123');
  } else {
    console.log('Admin user already exists');
  }
} catch (error) {
  console.error('Error creating admin user:', error);
}

// Seed initial data
// Seed initial data
const experienceCount = db.prepare('SELECT COUNT(*) as count FROM experience').get();
if (experienceCount.count === 0) {
  const insertExp = db.prepare(`INSERT INTO experience (logo, title, company, location, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  insertExp.run(
    '/uploads/1768654704136-843528075.jpg',
    'Full Stack Software Developer',
    'AlgoVerse',
    'Dhaka, Bangladesh',
    'Oct 2023',
    'Present',
    JSON.stringify([
      'Developed and deployed robust full-stack applications using React,Next.js ASP.NET, C#, and Node.js',
      'Architected containerized applications using Docker',
      'Integrated AI APIs into core features',
      'Implemented real-time communication using Socket.io',
      'Developed cross-platform mobile applications using Flutter and React Native'
    ])
  );

  insertExp.run(
    '/uploads/1768654639780-579034656.jpg',
    'Senior Software Engineer',
    'Zentorra',
    'Dhaka, Bangladesh',
    'Aug 2024',
    'May 2025',
    JSON.stringify([
      'Contributed to scalable software solutions and advanced system design',
      'Collaborated with cross-functional teams to deliver high-quality features'
    ])
  );
}

const educationCount = db.prepare('SELECT COUNT(*) as count FROM education').get();
if (educationCount.count === 0) {
  const insertEdu = db.prepare(`INSERT INTO education (logo, degree, institution, location, year) VALUES (?, ?, ?, ?, ?)`);

  insertEdu.run('/uploads/1768631203930-413340657.png', 'Bachelor of Science in Computer Science', 'BRAC University', 'Dhaka', '2022');
  insertEdu.run('/uploads/1768631283787-198298737.png', 'College', 'BAF SHAHEEN COLLEGE', 'Dhaka', '2018');
  insertEdu.run('/uploads/1768631436933-98260672.jpg', 'School', 'Cambrian School', 'Dhaka', '2012-2018');
}

const projectsCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
if (projectsCount.count === 0) {
  const insertProj = db.prepare(`INSERT INTO projects (image, title, description, link) VALUES (?, ?, ?, ?)`);

  insertProj.run('/uploads/1768655178084-937548840.jpeg', 'Zenova ac', 'A comprehensive AC management mobile application for controlling and monitoring air conditioning units remotely.', 'https://play.google.com/store/apps/details?id=com.mtl.conveyance');
  insertProj.run('/uploads/1768655270234-728393509.jpeg', 'NFL Game', 'An AI-powered sports prediction and analysis app for NFL enthusiasts, featuring real-time stats and insights.', 'https://apps.apple.com/us/app/full-send-sports-ai/id6751740118');
  insertProj.run('/uploads/1768655449198-231454187.jpg', 'School Management Software', 'A full-featured school management system including student records, attendance, grading, and administrative tools.', 'https://school-management-web-khaki.vercel.app/');
  insertProj.run('/uploads/1768655689342-683593534.jpg', 'Bikalpo Multivendor', 'A scalable multi-vendor e-commerce platform with vendor dashboards, product management, and secure payment processing.', 'https://bikalpo.com/');
  insertProj.run('/uploads/1768656394434-72439495.png', 'Real Estate', 'A modern real estate property listing website with search filtering, property details, and contact integration.', 'https://rockdalepropertiesltd.com/');
  insertProj.run('/uploads/1768656581837-585996648.jpg', 'Research Publication', 'A platform for showcasing and managing research publications, featuring citation tracking and document viewing.', 'https://paper-trail-ui.vercel.app/');
}

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ============ AUTH ROUTES ============
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username);

  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username: admin.username });
});

// ============ EXPERIENCE ROUTES ============
app.get('/api/experience', (req, res) => {
  const experiences = db.prepare('SELECT * FROM experience ORDER BY created_at DESC').all();
  res.json(experiences.map(exp => ({
    ...exp,
    description: exp.description ? JSON.parse(exp.description) : []
  })));
});

app.post('/api/experience', authenticateToken, upload.single('logo'), (req, res) => {
  const { title, company, location, start_date, end_date, description } = req.body;
  const logo = req.file ? `/uploads/${req.file.filename}` : null;

  const result = db.prepare(
    'INSERT INTO experience (logo, title, company, location, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(logo, title, company, location, start_date, end_date, description);

  res.json({ id: result.lastInsertRowid, message: 'Experience added successfully' });
});

app.put('/api/experience/:id', authenticateToken, upload.single('logo'), (req, res) => {
  const { id } = req.params;
  const { title, company, location, start_date, end_date, description } = req.body;

  let query = 'UPDATE experience SET title = ?, company = ?, location = ?, start_date = ?, end_date = ?, description = ?';
  let params = [title, company, location, start_date, end_date, description];

  if (req.file) {
    query += ', logo = ?';
    params.push(`/uploads/${req.file.filename}`);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.prepare(query).run(...params);
  res.json({ message: 'Experience updated successfully' });
});

app.delete('/api/experience/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.id);
  res.json({ message: 'Experience deleted successfully' });
});

// ============ EDUCATION ROUTES ============
app.get('/api/education', (req, res) => {
  const education = db.prepare('SELECT * FROM education ORDER BY created_at DESC').all();
  res.json(education);
});

app.post('/api/education', authenticateToken, upload.single('logo'), (req, res) => {
  const { degree, institution, location, year } = req.body;
  const logo = req.file ? `/uploads/${req.file.filename}` : null;

  const result = db.prepare(
    'INSERT INTO education (logo, degree, institution, location, year) VALUES (?, ?, ?, ?, ?)'
  ).run(logo, degree, institution, location, year);

  res.json({ id: result.lastInsertRowid, message: 'Education added successfully' });
});

app.put('/api/education/:id', authenticateToken, upload.single('logo'), (req, res) => {
  const { id } = req.params;
  const { degree, institution, location, year } = req.body;

  let query = 'UPDATE education SET degree = ?, institution = ?, location = ?, year = ?';
  let params = [degree, institution, location, year];

  if (req.file) {
    query += ', logo = ?';
    params.push(`/uploads/${req.file.filename}`);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.prepare(query).run(...params);
  res.json({ message: 'Education updated successfully' });
});

app.delete('/api/education/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM education WHERE id = ?').run(req.params.id);
  res.json({ message: 'Education deleted successfully' });
});

// ============ PROJECTS ROUTES ============
app.get('/api/projects', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  res.json(projects);
});

app.post('/api/projects', authenticateToken, upload.single('image'), (req, res) => {
  const { title, description, link } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const result = db.prepare(
    'INSERT INTO projects (image, title, description, link) VALUES (?, ?, ?, ?)'
  ).run(image, title, description, link);

  res.json({ id: result.lastInsertRowid, message: 'Project added successfully' });
});

app.put('/api/projects/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description, link } = req.body;

  let query = 'UPDATE projects SET title = ?, description = ?, link = ?';
  let params = [title, description, link];

  if (req.file) {
    query += ', image = ?';
    params.push(`/uploads/${req.file.filename}`);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.prepare(query).run(...params);
  res.json({ message: 'Project updated successfully' });
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ message: 'Project deleted successfully' });
});

// Serve static files from React frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
