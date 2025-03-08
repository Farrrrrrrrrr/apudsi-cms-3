import { createPool, Pool, PoolOptions } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

let pool: Pool | null = null;

export async function getDbConnection() {
  try {
    if (!pool) {
      // Configuration object for the database connection
      const config: PoolOptions = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        // Add connection timeout and reconnect options
        connectTimeout: 60000, // 60 seconds
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000, // 10 seconds
      };

      // Add port for connections if specified
      if (process.env.DB_PORT) {
        config.port = parseInt(process.env.DB_PORT, 10);
      }

      // If SSL is enabled, configure it appropriately
      if (process.env.DB_SSL_ENABLED === 'true') {
        // Basic SSL configuration (similar to how HeidiSQL connects)
        config.ssl = {
          // Don't require certificate verification by default (like HeidiSQL)
          rejectUnauthorized: process.env.DB_VERIFY_CERTIFICATE === 'true'
        };
        
        // Add CA certificate only if explicitly configured
        const certPath = process.env.DB_CERT_PATH || './certs';
        if (process.env.DB_CA_CERT && fs.existsSync(path.resolve(certPath, process.env.DB_CA_CERT))) {
          config.ssl.ca = fs.readFileSync(path.resolve(certPath, process.env.DB_CA_CERT));
        }
      }

      console.log('Creating database connection pool...');
      pool = createPool(config);
      
      // Verify the connection works
      try {
        const connection = await pool.getConnection();
        console.log('Database connection established successfully');
        connection.release();
      } catch (err) {
        console.error('Failed to establish initial database connection:', err);
        pool = null; // Clear the pool so it can be recreated on next attempt
        throw err;
      }
    }
    
    return pool;
  } catch (error) {
    console.error('Error initializing database connection:', error);
    throw error;
  }
}

export async function getUserByCredentials(email: string, password: string) {
  try {
    const db = await getDbConnection();
    
    // Note: In production, you'd want to use proper password hashing
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    const users = rows as any[];
    return users[0] || null;
  } catch (error) {
    console.error('Database error in getUserByCredentials:', error);
    throw error; // Re-throw to allow proper error handling upstream
  }
}

export async function getUserById(id: string | number) {
  try {
    const db = await getDbConnection();
    
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    const users = rows as any[];
    return users[0] || null;
  } catch (error) {
    console.error('Database error in getUserById:', error);
    throw error; // Re-throw to allow proper error handling upstream
  }
}

export interface SimpleArticle {
  id?: number;
  title: string;
  image_url: string;
  content: string;
  author_id: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export async function createSimpleArticle(article: SimpleArticle) {
  try {
    const db = await getDbConnection();
    
    // Changed table name from simple_articles to draft
    const [result] = await db.execute(
      'INSERT INTO draft (title, image_url, content, author_id, status) VALUES (?, ?, ?, ?, ?)',
      [article.title, article.image_url, article.content, article.author_id, article.status || 'draft']
    );
    
    const insertId = (result as any).insertId;
    return { ...article, id: insertId };
  } catch (error) {
    console.error('Database error in createSimpleArticle:', error);
    throw error;
  }
}

export async function getSimpleArticles() {
  try {
    const db = await getDbConnection();
    
    // Changed table name from simple_articles to draft
    const [rows] = await db.execute(`
      SELECT a.*, u.name as author_name 
      FROM draft a 
      JOIN users u ON a.author_id = u.id 
      ORDER BY a.created_at DESC
    `);
    
    return rows as any[];
  } catch (error) {
    console.error('Database error in getSimpleArticles:', error);
    throw error;
  }
}

export async function getSimpleArticleById(id: number) {
  try {
    const db = await getDbConnection();
    
    // Changed table name from simple_articles to draft
    const [rows] = await db.execute(`
      SELECT a.*, u.name as author_name 
      FROM draft a 
      JOIN users u ON a.author_id = u.id 
      WHERE a.id = ?
    `, [id]);
    
    const articles = rows as any[];
    return articles[0] || null;
  } catch (error) {
    console.error('Database error in getSimpleArticleById:', error);
    throw error;
  }
}

export async function updateSimpleArticle(article: SimpleArticle) {
  try {
    const db = await getDbConnection();
    
    // Changed table name from simple_articles to draft
    await db.execute(
      'UPDATE draft SET title = ?, image_url = ?, content = ?, status = ? WHERE id = ?',
      [article.title, article.image_url, article.content, article.status || 'draft', article.id]
    );
    
    return article;
  } catch (error) {
    console.error('Database error in updateSimpleArticle:', error);
    throw error;
  }
}
