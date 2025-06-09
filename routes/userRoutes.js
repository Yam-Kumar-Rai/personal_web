const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // ✅ Correct import, no destructuring

// Users' project page
router.get('/project', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY project_date DESC');
    const projects = result.rows;
    res.render('Users/project', { projects }); // ✅ Ensure 'Users/project' is the correct view path
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
