import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
console.log('MongoDB URI:', uri); // Debug log

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
    console.log('Creating new MongoDB connection'); // Debug log
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const dbUtils = {
  createUser: async (username: string, email: string, password: string) => {
    try {
      console.log('Creating user:', { username, email }); // Debug log
      const client = await clientPromise;
      const db = client.db('test');
      const result = await db.collection('users').insertOne({
        username,
        email,
        password_hash: password,
        created_at: new Date()
      });
      console.log('User created successfully:', result); // Debug log
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  validateUser: async (email: string, password: string) => {
    try {
      const client = await clientPromise;
      const db = client.db('test');
      const result = await db.collection('users').findOne({ 
        email, 
        password_hash: password 
      });
      console.log('User validation result:', result ? 'Found' : 'Not found'); // Debug log
      return result;
    } catch (error) {
      console.error('Error validating user:', error);
      throw error;
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      const client = await clientPromise;
      const db = client.db('test');
      const result = await db.collection('users').findOne({ email });
      console.log('Get user by email result:', result ? 'Found' : 'Not found'); // Debug log
      return result;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
}; 