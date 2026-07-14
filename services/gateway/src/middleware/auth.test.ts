import { authenticateToken } from './auth';
import * as admin from 'firebase-admin';
import axios from 'axios';

jest.mock('firebase-admin', () => {
  const mockVerifyIdToken = jest.fn();
  return {
    auth: jest.fn().mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    }),
    credential: {
      cert: jest.fn(),
      applicationDefault: jest.fn(),
    },
    initializeApp: jest.fn(),
  };
});

jest.mock('axios');

describe('Gateway Auth Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: any;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  test('should pass if no authorization header is present', async () => {
    await authenticateToken(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.headers['x-user-id']).toBeUndefined();
  });

  test('should handle mock-token successfully', async () => {
    mockRequest.headers['authorization'] = 'Bearer mock-token';
    await authenticateToken(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.headers['x-user-id']).toBe('mock-uuid-12345');
    expect(mockRequest.headers['x-user-role']).toBe('customer');
  });

  test('should verify valid firebase token and sync user', async () => {
    mockRequest.headers['authorization'] = 'Bearer valid-firebase-token';
    
    // Mock Firebase verification
    const mockVerifyIdToken = admin.auth().verifyIdToken as jest.Mock;
    mockVerifyIdToken.mockResolvedValue({
      uid: 'firebase-uid-123',
      email: 'test@example.com',
      name: 'Test User',
    });

    // Mock User Service sync call
    const mockAxiosPost = axios.post as jest.Mock;
    mockAxiosPost.mockResolvedValue({
      data: {
        id: 'db-user-uuid-999',
        role: 'customer',
      }
    });

    await authenticateToken(mockRequest, mockResponse, nextFunction);

    expect(mockVerifyIdToken).toHaveBeenCalledWith('valid-firebase-token');
    expect(mockAxiosPost).toHaveBeenCalledWith('http://localhost:5001/users/sync', {
      firebaseUid: 'firebase-uid-123',
      email: 'test@example.com',
      name: 'Test User',
      phone: '',
    });
    expect(mockRequest.headers['x-user-id']).toBe('db-user-uuid-999');
    expect(mockRequest.headers['x-user-role']).toBe('customer');
    expect(nextFunction).toHaveBeenCalled();
  });

  test('should return 401 if Firebase token verification fails', async () => {
    mockRequest.headers['authorization'] = 'Bearer invalid-token';
    
    const mockVerifyIdToken = admin.auth().verifyIdToken as jest.Mock;
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

    await authenticateToken(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid or expired authentication token' });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
