import { getDbConnection } from '../lib/database';

/**
 * Script to create initial database schema for the APUDSI CMS
 */
async function createSchema() {
  const db = await getDbConnection();
  
  try {
    console.log('Creating users table...');
    
    // Create users table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Check if we need to create an initial admin user
    const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
    const userCount = (users as any[])[0].count;
    
    if (userCount === 0) {
      console.log('Creating default admin user...');
      
      // Create default admin user
      await db.execute(`
        INSERT INTO users (name, email, password, role) 
        VALUES ('Admin', 'admin@example.com', 'adminpass', 'admin')
      `);
      
      console.log('Default admin user created with:');
      console.log('Email: admin@example.com');
      console.log('Password: adminpass');
      console.log('NOTE: Please change this password immediately after first login!');
    }
    
    console.log('Schema setup completed successfully');
  } catch (error) {
    console.error('Error setting up schema:', error);
    process.exit(1);
  } finally {
    // Close the connection pool
    await db.end();
  }
}

// Run the script if executed directly
if (require.main === module) {
  // Load environment variables
  require('dotenv').config();
  
  createSchema()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Schema creation failed:', error);
      process.exit(1);
    });
}
