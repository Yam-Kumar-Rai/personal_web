const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');

const pool = require('../config/db'); // import pool without destructuring

// Setup multer storage for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../public/uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Helper to validate and format date to YYYY-MM-DD or return null
function formatDate(input) {
  if (!input) return null;
  const d = new Date(input);
  if (isNaN(d)) return null;
  return d.toISOString().split('T')[0];
}

// POST /admin/addproject
router.post('/addproject', ensureAuthenticated, upload.single('projectImage'), async (req, res) => {
  const { projectTitle, projectDescription, Link, projectDate } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const formattedDate = formatDate(projectDate) || new Date().toISOString().split('T')[0];

  const sql = `
    INSERT INTO projects (title, description, link, image, project_date)
    VALUES ($1, $2, $3, $4, $5)
  `;

  const params = [projectTitle, projectDescription, Link, imagePath, formattedDate];

  try {
    await pool.query(sql, params);
    res.redirect('/Admin/dashboard');
  } catch (err) {
    console.error('Error inserting project:', err);
    res.status(500).send('Error adding project');
  }
});

// POST /admin/editproject/:id
router.post('/editproject/:id', ensureAuthenticated, upload.single('projectImage'), async (req, res) => {
  const projectId = req.params.id;
  const { projectTitle, projectDescription, Link, projectDate } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const formattedDate = formatDate(projectDate);
  if (!formattedDate) {
    return res.status(400).send('Invalid date format');
  }

  let sql, params;

  if (imagePath) {
    sql = `
      UPDATE projects
      SET title = $1, description = $2, link = $3, image = $4, project_date = $5
      WHERE id = $6
    `;
    params = [projectTitle, projectDescription, Link, imagePath, formattedDate, projectId];
  } else {
    sql = `
      UPDATE projects
      SET title = $1, description = $2, link = $3, project_date = $4
      WHERE id = $5
    `;
    params = [projectTitle, projectDescription, Link, formattedDate, projectId];
  }

  try {
    await pool.query(sql, params);
    res.redirect('/Admin/dashboard');
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).send('Error updating project');
  }
});

// DELETE PROJECT by ID
router.post('/delete/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const projectId = req.params.id;

  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);
    res.redirect('/Admin/dashboard');
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).send('Error deleting project');
  }
});

module.exports = router;
