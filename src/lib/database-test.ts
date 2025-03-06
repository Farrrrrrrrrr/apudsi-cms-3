import { getDbConnection } from './database';

/**
 * Utility function to test the database connection
 * Can be used during initialization to verify connectivity
 */
export async function testDatabaseConnection() {
  try {
    const pool = await getDbConnection();
    const [result] = await pool.query('SELECT 1 as connection_test');
    
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// This can be run directly with ts-node or similar tools
if (require.main === module) {
  // Load environment variables from .env file when running directly
  require('dotenv').config();
  
  testDatabaseConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
