import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

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
  },

  createCourse: async (userId: string, courseData: {
    title: string,
    icon: string,
    bgColor: string
  }) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const result = await db.collection('courses').insertOne({
        userId,
        title: courseData.title,
        icon: courseData.icon,
        bgColor: courseData.bgColor,
        progress: 0,
        created_at: new Date()
      });
      console.log('Course created:', result);
      return result;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  getUserCourses: async (userId: string) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      return await db.collection('courses')
        .find({ userId })
        .toArray();
    } catch (error) {
      console.error('Error fetching user courses:', error);
      throw error;
    }
  },

  createTopic: async (courseId: string, topicData: {
    title: string,
    subtopics?: string[],
    fileType?: string,
    fileUrl?: string,
    created_at: Date
  }) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const result = await db.collection('topics').insertOne({
        courseId,
        ...topicData
      });
      return result;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  },

  getCourseWithTopics: async (courseId: string) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      
      const course = await db.collection('courses').findOne({ 
        _id: new ObjectId(courseId) 
      });

      if (!course) return null;

      const topics = await db.collection('topics')
        .find({ courseId })
        .toArray();

      return {
        ...course,
        topics
      };
    } catch (error) {
      console.error('Error fetching course with topics:', error);
      throw error;
    }
  },

  updateTopicNotes: async (topicId: string, notes: string) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      return await db.collection('topics').updateOne(
        { _id: new ObjectId(topicId) },
        { $set: { generatedNotes: notes } }
      );
    } catch (error) {
      console.error('Error updating topic notes:', error);
      throw error;
    }
  },

  getTopicById: async (topicId: string) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      return await db.collection('topics').findOne({ 
        _id: new ObjectId(topicId) 
      });
    } catch (error) {
      console.error('Error fetching topic:', error);
      throw error;
    }
  },

  deleteCourse: async (courseId: string) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      
      // Delete all topics associated with the course
      await db.collection('topics').deleteMany({
        courseId: new ObjectId(courseId)
      });
      
      // Delete the course
      await db.collection('courses').deleteOne({
        _id: new ObjectId(courseId)
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  deleteTopic: async (topicId: string) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      
      await db.collection('topics').deleteOne({
        _id: new ObjectId(topicId)
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    }
  }
}; 