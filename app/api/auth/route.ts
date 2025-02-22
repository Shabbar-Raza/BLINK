import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';

export async function POST(request: Request) {
  try {
    const { action, ...data } = await request.json();
    console.log('Auth API called with action:', action, 'data:', data); // Debug log

    switch (action) {
      case 'register':
        const { username, email, password } = data;
        console.log('Checking for existing user'); // Debug log
        const existingUser = await dbUtils.getUserByEmail(email);
        
        if (existingUser) {
          console.log('User already exists'); // Debug log
          return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }
        
        console.log('Creating new user'); // Debug log
        await dbUtils.createUser(username, email, password);
        return NextResponse.json({ success: true });

      case 'login':
        console.log('Attempting login'); // Debug log
        const user = await dbUtils.validateUser(data.email, data.password);
        
        if (!user) {
          console.log('Invalid credentials'); // Debug log
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        
        console.log('Login successful'); // Debug log
        return NextResponse.json({ success: true });

      default:
        console.log('Invalid action:', action); // Debug log
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 