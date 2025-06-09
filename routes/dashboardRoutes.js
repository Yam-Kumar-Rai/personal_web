const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { getAllProjects } = require('../models/projectModels');
const { getAllContacts } = require('../models/ContactModels');

// Unified dashboard route
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const projects = await getAllProjects(); // ✅ Load projects from model
    res.render('Admin/dashboard', {
      projects,
      adminEmail: req.session.adminEmail // ✅ Still send email if needed
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
