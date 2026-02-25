import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
  });
  
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME || 'zenythh');

  // Create indexes (non-blocking)
  Promise.all([
    db.collection('memes').createIndex({ userId: 1, createdAt: -1 }),
    db.collection('memes').createIndex({ createdAt: -1 }),
    db.collection('content_plans').createIndex({ userId: 1, createdAt: -1 }),
    db.collection('content_plans').createIndex({ createdAt: -1 }),
    db.collection('competitor_analyses').createIndex({ userId: 1, analyzedAt: -1 }),
    db.collection('competitor_analyses').createIndex({ analyzedAt: -1 }),
  ]).catch(err => console.error('Index creation error:', err));

  return db;
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
