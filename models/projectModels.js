const db = require('../config/db'); // your DB connection

async function createProjectsTable() {
  const createQuery = `
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

  const alterQuery = `
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_date DATE;
  `;

  try {
    await db.query(createQuery);
    await db.query(alterQuery); // Add column if missing
    console.log('Projects table ensured and updated successfully!');
  } catch (error) {
    console.error('Error ensuring projects table schema:', error);
  }
}

createProjectsTable();
