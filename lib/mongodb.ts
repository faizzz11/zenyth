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

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME || 'zenythh');

  // Create indexes
  await db.collection('memes').createIndex({ userId: 1, createdAt: -1 });
  await db.collection('memes').createIndex({ createdAt: -1 });
  await db.collection('content_plans').createIndex({ userId: 1, createdAt: -1 });
  await db.collection('content_plans').createIndex({ createdAt: -1 });

  return db;
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
