const db = require('../config/db'); // your DB connection

async function createProjectsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image TEXT,
      link TEXT,
      project_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(query);
    console.log('Projects table created successfully!');
  } catch (error) {
    console.error('Error creating projects table:', error);
  }
}

createProjectsTable();
