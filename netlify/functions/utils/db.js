import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb && cachedClient) {
    // Verify if connection is still alive
    try {
      await cachedClient.db().admin().ping();
      console.log("Using cached database connection");
      return { db: cachedDb, client: cachedClient };
    } catch (e) {
      console.log("Cached connection failed, creating new connection");
      cachedClient = null;
      cachedDb = null;
    }
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  if (!process.env.MONGODB_DB) {
    throw new Error('MONGODB_DB environment variable is not defined');
  }

  try {
    console.log("Establishing new database connection");
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    const db = client.db(process.env.MONGODB_DB);
    
    // Test the connection
    await db.command({ ping: 1 });
    
    cachedClient = client;
    cachedDb = db;
    
    console.log("Database connection established successfully");
    return { db, client };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
}
