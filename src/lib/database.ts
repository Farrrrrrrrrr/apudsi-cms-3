import { createPool, Pool } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

let pool: Pool | null = null;

export async function getDbConnection() {
  if (!pool) {
    // Configuration object for the database connection
    const config: any = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    // If SSL is enabled, add certificate configuration
    if (process.env.DB_SSL_ENABLED === 'true') {
      // Get the path to the certificates
      const certPath = process.env.DB_CERT_PATH || '';
      
      // SSL/TLS configuration
      config.ssl = {
        // Require SSL for all connections
        rejectUnauthorized: true
      };
      
      // Add CA certificate if available
      if (process.env.DB_CA_CERT && fs.existsSync(path.resolve(certPath, process.env.DB_CA_CERT))) {
        config.ssl.ca = fs.readFileSync(path.resolve(certPath, process.env.DB_CA_CERT));
      }
      
      // Add client certificate if available
      if (process.env.DB_CLIENT_CERT && fs.existsSync(path.resolve(certPath, process.env.DB_CLIENT_CERT))) {
        config.ssl.cert = fs.readFileSync(path.resolve(certPath, process.env.DB_CLIENT_CERT));
      }
      
      // Add client key if available
      if (process.env.DB_CLIENT_KEY && fs.existsSync(path.resolve(certPath, process.env.DB_CLIENT_KEY))) {
        config.ssl.key = fs.readFileSync(path.resolve(certPath, process.env.DB_CLIENT_KEY));
      }
      
      // Add port for Aiven connections if specified
      if (process.env.DB_PORT) {
        config.port = parseInt(process.env.DB_PORT, 10);
      }
    }

    // Create the connection pool with the configuration
    pool = createPool(config);
  }
  
  return pool;
}

export async function getUserByCredentials(email: string, password: string) {
  const db = await getDbConnection();
  
  try {
    // Note: In production, you'd want to use proper password hashing
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    const users = rows as any[];
    return users[0] || null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function getUserById(id: string | number) {
  const db = await getDbConnection();
  
  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    const users = rows as any[];
    return users[0] || null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}
