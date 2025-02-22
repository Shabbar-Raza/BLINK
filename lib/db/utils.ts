import { User } from './schema';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

export const dbUtils = {
  createUser: async (username: string, email: string, password: string) => {
    const passwordHash = hashPassword(password);
    const user = new User({
      username,
      email,
      password_hash: passwordHash
    });
    return await user.save();
  },

  validateUser: async (email: string, password: string) => {
    const passwordHash = hashPassword(password);
    return await User.findOne({ 
      email, 
      password_hash: passwordHash 
    });
  },

  getUserByEmail: async (email: string) => {
    return await User.findOne({ email });
  },

  getAllUsers: async () => {
    return await User.find({});
  }
}; 