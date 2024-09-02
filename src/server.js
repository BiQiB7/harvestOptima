const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Create a single connection pool for the entire application
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'harvestOptimaDB',  // Make sure this is the correct database name
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connection was successful');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

app.post('/api/query', async (req, res) => {
  console.log('Received request body:', req.body);

  try {
    const { keywords } = req.body;
    
    if (!keywords || !Array.isArray(keywords)) {
      console.log('Invalid keywords:', keywords);
      return res.status(400).json({ error: 'Invalid keywords' });
    }

    const placeholders = keywords.map(() => '?').join(' OR c1.crop_name LIKE ');
    const query = `
      SELECT 
        c1.id AS crop_id,
        c1.crop_name,
        c1.recommended_nitrogen,
        c1.recommended_potassium,
        c1.recommended_phosphorus,
        c2.crop_name AS rotatable_with
      FROM 
        crops c1
      LEFT JOIN 
        crop_rotation cr ON c1.id = cr.crop_id
      LEFT JOIN 
        crops c2 ON cr.rotatable_with_id = c2.id
      WHERE 
        c1.crop_name LIKE ${placeholders}
    `;
    const values = keywords.map(keyword => `%${keyword}%`);

    console.log('Executing SQL query:', query);
    console.log('Query values:', values);

    const [rows] = await pool.execute(query, values);

    console.log('Query executed successfully');
    console.log('Number of rows returned:', rows.length);

    // Process the results to group rotatable crops
    const processedResults = rows.reduce((acc, row) => {
      if (!acc[row.crop_id]) {
        acc[row.crop_id] = {
          crop_name: row.crop_name,
          recommended_nitrogen: row.recommended_nitrogen,
          recommended_potassium: row.recommended_potassium,
          recommended_phosphorus: row.recommended_phosphorus,
          rotatable_with: []
        };
      }
      if (row.rotatable_with) {
        acc[row.crop_id].rotatable_with.push(row.rotatable_with);
      }
      return acc;
    }, {});

    res.json(Object.values(processedResults));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

const port = 3001;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));