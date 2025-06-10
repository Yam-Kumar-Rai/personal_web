// Core modules and environment setup
const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

// Create Express app and set port
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true only for HTTPS production
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// =====================
// 🌐 Public Page Routes
// =====================

app.get('/', (req, res) => res.redirect('/home'));

// Main pages
app.get('/home', (req, res) => res.render('Users/home'));
app.get('/about', (req, res) => res.render('Users/about'));
app.get('/skill', (req, res) => res.render('Users/skill'));
app.get('/project', (req, res) => res.redirect('/Users/project')); // Use Users/projects from userRoutes
app.get('/contact', (req, res) => res.render('Users/contact'));
app.get('/login', (req, res) => res.render('Users/login', { message: null }));

// Logout clears session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.redirect('/home');
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// ==========================
// 📥 Contact Form Submission
// ==========================

const pool = require('./config/db'); // DB connection for storing contacts

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Store message in DB
    await pool.query(
      'INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject || 'No Subject', message]
    );

    // Optionally add: Email Notification via Nodemailer here

    res.redirect('/contact?success=1'); // redirect with success flag
  } catch (err) {
    console.error('❌ Contact form error:', err.message);
    res.status(500).send('Internal server error. Please try again later.');
  }
});

// ==========================
// 📄 CV Download Route
// ==========================

app.get('/download-cv', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'assets', 'Yam_Kumar_Rai_CV.pdf');
  res.download(filePath, 'Yam_Kumar_Rai_CV.pdf');
});

// ===================
// 🔐 Admin Routes Setup
// ===================

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

// Auth-related routes (login, signup, etc.)
app.use('/auth', authRoutes);

// Protect all /Admin routes with session authentication
app.use('/Admin', (req, res, next) => {
  if (!req.session.isAuthenticated || !req.session.user) {
    return res.redirect('/login');
  }
  next();
});

// Admin-specific routes
app.use('/Admin', adminRoutes);
app.use('/Admin', dashboardRoutes);
app.use('/Admin', projectRoutes);

// Public User-specific (frontend) routes
app.use('/Users', userRoutes);

// Optional: API route for AJAX-based project listing
app.use('/api/project', require('./routes/projectRoutes'));

// ===================
// 🚀 Start the Server
// ===================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
