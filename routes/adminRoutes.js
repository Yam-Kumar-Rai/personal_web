const express = require('express');
const router = express.Router();
const pool = require('../config/db');  // Correct import without destructuring
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');

// Admin dashboard
router.get('/dashboard', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY project_date DESC');
    res.render('Admin/dashboard', { projects: result.rows });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Add project form
router.get('/addproject', ensureAuthenticated, ensureAdmin, (req, res) => {
  res.render('Admin/addproject');
});

// Edit project form
router.get('/edit/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const projectId = req.params.id;
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    const project = result.rows[0];
    if (!project) return res.status(404).send('Project not found');
    res.render('Admin/editProject', { project });
  } catch (err) {
    console.error('Error loading edit page:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Handle project update
router.post('/edit/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description, link, project_date } = req.body;
    await pool.query(
      'UPDATE projects SET title = $1, description = $2, link = $3, project_date = $4 WHERE id = $5',
      [title, description, link, project_date, projectId]
    );
    res.redirect('/Admin/dashboard');
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete project
router.post('/delete/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const projectId = req.params.id;
    await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);
    res.redirect('/Admin/dashboard');
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
