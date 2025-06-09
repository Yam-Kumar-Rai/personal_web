const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');

const pool = require('../config/db');  // Correct import without destructuring

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

// POST /admin/addproject
router.post('/addproject', ensureAuthenticated, upload.single('projectImage'), async (req, res) => {
  const { projectTitle, projectDescription, Link } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO projects (title, description, link, image, project_date)
    VALUES ($1, $2, $3, $4, NOW())
  `;

  const params = [projectTitle, projectDescription, Link, imagePath];

  try {
    await pool.query(sql, params);
    res.redirect('/Admin/dashboard'); // Redirect after success
  } catch (err) {
    console.error('Error inserting project:', err);
    res.status(500).send('Error adding project');
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
