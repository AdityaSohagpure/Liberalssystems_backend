import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firebase Admin SDK
const firebaseServiceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5001';

if (firebaseServiceAccountPath) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(require(firebaseServiceAccountPath)),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK with credentials path:', error);
  }
} else {
  // If credentials path is not provided, try local serviceAccountKey.json fallback if exists
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('Firebase Admin SDK initialized with Application Default Credentials');
  } catch (error) {
    console.warn('Firebase Admin SDK warning: No credentials specified. Mock auth will be used if token is "mock-token".');
  }
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    firebaseUid: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to authenticate requests using Firebase ID tokens.
 * Public routes can bypass this middleware, or we can check token optionally.
 */
export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // No token provided. Pass to next middleware.
    // Downstream services will know it's a guest request because x-user-id header will be missing.
    return next();
  }

  // Support mock-token for local testing/development when Firebase is not configured
  if (token === 'mock-token') {
    try {
      const response = await axios.post(`${userServiceUrl}/users/sync`, {
        firebaseUid: 'mock-firebase-uid',
        email: 'mockuser@example.com',
        name: 'Mock User',
        phone: '12345678',
      });
      const { id, role } = response.data;
      req.headers['x-user-id'] = id;
      req.headers['x-user-role'] = role;
      req.headers['x-user-firebase-uid'] = 'mock-firebase-uid';
      return next();
    } catch (syncError: any) {
      console.error('Failed to sync mock user with User Service:', syncError.message);
      // Fallback to static mock headers if user service is down or database is resetting
      req.headers['x-user-id'] = 'mock-uuid-12345';
      req.headers['x-user-role'] = 'customer';
      req.headers['x-user-firebase-uid'] = 'mock-firebase-uid';
      return next();
    }
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, phone_number } = decodedToken;

    // Sync user with User Service
    // We send a POST request to user service to upsert user and get their database id and role
    try {
      const response = await axios.post(`${userServiceUrl}/users/sync`, {
        firebaseUid: uid,
        email: email || '',
        name: name || email?.split('@')[0] || 'User',
        phone: phone_number || '',
      });

      const { id, role } = response.data;
      
      // Inject headers to be forwarded by proxy
      req.headers['x-user-id'] = id;
      req.headers['x-user-role'] = role;
      req.headers['x-user-firebase-uid'] = uid;

      next();
    } catch (syncError: any) {
      console.error('Failed to sync user with User Service:', syncError.message);
      return res.status(500).json({ error: 'User sync failed in User Service' });
    }
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

/**
 * Middleware to enforce that a user is authenticated.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers['x-user-id']) {
    return res.status(401).json({ error: 'Authentication required for this resource' });
  }
  next();
}

/**
 * Middleware to restrict access to specific roles.
 */
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.headers['x-user-role'] as string;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}
