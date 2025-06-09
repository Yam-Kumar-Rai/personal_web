const db = require('../config/db'); // your DB connection

async function createContactsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(query);
    console.log('Contacts table created successfully!');
  } catch (error) {
    console.error('Error creating contacts table:', error);
  }
}

createContactsTable();
