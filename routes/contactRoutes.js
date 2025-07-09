const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /contact
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await pool.query(
      `INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4)`,
      [name, email, subject, message]
    );
    res.redirect('/contact'); // Or redirect to a success page
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
