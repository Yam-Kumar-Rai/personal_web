const express = require('express');
const path = require('path');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static file serving (for CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/home', (req, res) => {
  res.render('home'); // Render home.ejs
});

// Other routes for the navigation menu
app.get('/about', (req, res) => {
  res.render('about'); // Render about.ejs
});

app.get('/skills', (req, res) => {
  res.render('skills'); // Render skills.ejs
});

app.get('/projects', (req, res) => {
  res.render('projects'); // Render projects.ejs
});

app.get('/contact', (req, res) => {
  res.render('contact'); // Render contact.ejs
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
