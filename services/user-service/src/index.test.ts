import request from 'supertest';

const mockUserFindUnique = jest.fn();
const mockUserCreate = jest.fn();
const mockUserUpdate = jest.fn();
const mockAddressFindUnique = jest.fn();
const mockAddressFindMany = jest.fn();
const mockAddressFindFirst = jest.fn();
const mockAddressCount = jest.fn();
const mockAddressCreate = jest.fn();
const mockAddressUpdate = jest.fn();
const mockAddressUpdateMany = jest.fn();
const mockAddressDelete = jest.fn();

jest.mock('./generated/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        user: {
          findUnique: mockUserFindUnique,
          create: mockUserCreate,
          update: mockUserUpdate,
        },
        address: {
          findUnique: mockAddressFindUnique,
          findMany: mockAddressFindMany,
          findFirst: mockAddressFindFirst,
          count: mockAddressCount,
          create: mockAddressCreate,
          update: mockAddressUpdate,
          updateMany: mockAddressUpdateMany,
          delete: mockAddressDelete,
        },
      };
    }),
  };
});

// Mock console.error to keep the test output clean
jest.spyOn(console, 'error').mockImplementation(() => {});

process.env.PORT = '0';
import { app } from './index';

describe('User Service API Endpoints', () => {
  const userId = 'user-uuid-123';
  const mockUser = {
    id: userId,
    firebaseUid: 'fb-uid-123',
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    role: 'customer',
    wishlist: ['prod-1', 'prod-2'],
    isActive: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkActiveUser Middleware', () => {
    test('should return 401 if x-user-id header is missing', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('User ID missing');
    });

    test('should return 404 if user does not exist', async () => {
      mockUserFindUnique.mockResolvedValueOnce(null);
      const res = await request(app)
        .get('/api/users/me')
        .set('x-user-id', userId);
      expect(res.status).toBe(404);
      expect(res.body.error).toContain('User not found');
    });

    test('should return 404 if user profile is deactivated', async () => {
      mockUserFindUnique.mockResolvedValueOnce({ ...mockUser, isActive: false });
      const res = await request(app)
        .get('/api/users/me')
        .set('x-user-id', userId);
      expect(res.status).toBe(404);
      expect(res.body.error).toContain('User profile is deactivated');
    });
  });

  describe('GET /api/users/me', () => {
    test('should return profile with addresses if user is active', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser); // for checkActiveUser
      mockUserFindUnique.mockResolvedValueOnce({ ...mockUser, addresses: [] }); // for GET handler
      
      const res = await request(app)
        .get('/api/users/me')
        .set('x-user-id', userId);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(userId);
      expect(res.body.addresses).toEqual([]);
    });
  });

  describe('PUT /api/users/me', () => {
    test('should update profile fields and return updated user', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      mockUserUpdate.mockResolvedValueOnce({ ...mockUser, name: 'Updated Name' });

      const res = await request(app)
        .put('/api/users/me')
        .set('x-user-id', userId)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Name');
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: userId },
        data: { name: 'Updated Name', phone: undefined },
      });
    });
  });

  describe('DELETE /api/users/me', () => {
    test('should deactivate user profile (soft-delete)', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      mockUserUpdate.mockResolvedValueOnce({ ...mockUser, isActive: false });

      const res = await request(app)
        .delete('/api/users/me')
        .set('x-user-id', userId);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('deactivated successfully');
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: userId },
        data: { isActive: false },
      });
    });
  });

  describe('GET /api/users/me/addresses', () => {
    test('should list saved addresses', async () => {
      const mockAddresses = [{ id: 'addr-1', street: '123 St', isDefault: true }];
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      mockAddressFindMany.mockResolvedValueOnce(mockAddresses);

      const res = await request(app)
        .get('/api/users/me/addresses')
        .set('x-user-id', userId);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockAddresses);
    });
  });

  describe('POST /api/users/me/addresses', () => {
    const newAddr = {
      street: '123 St',
      city: 'City',
      state: 'State',
      country: 'Country',
      postalCode: '12345',
      isDefault: false,
    };

    test('should fail if required fields are missing', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      const res = await request(app)
        .post('/api/users/me/addresses')
        .set('x-user-id', userId)
        .send({ street: '123 St' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('required');
    });

    test('should force first address to be default', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      mockAddressCount.mockResolvedValueOnce(0);
      mockAddressCreate.mockResolvedValueOnce({ ...newAddr, id: 'addr-1', isDefault: true });

      const res = await request(app)
        .post('/api/users/me/addresses')
        .set('x-user-id', userId)
        .send(newAddr);

      expect(res.status).toBe(201);
      expect(res.body.isDefault).toBe(true);
      expect(mockAddressUpdateMany).not.toHaveBeenCalled(); // No other addresses to unset
      expect(mockAddressCreate).toHaveBeenCalledWith({
        data: {
          userId,
          street: newAddr.street,
          city: newAddr.city,
          state: newAddr.state,
          country: newAddr.country,
          postalCode: newAddr.postalCode,
          isDefault: true,
        },
      });
    });

    test('should unset other defaults if adding a new default address', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      mockAddressCount.mockResolvedValueOnce(1);
      mockAddressCreate.mockResolvedValueOnce({ ...newAddr, id: 'addr-2', isDefault: true });

      const res = await request(app)
        .post('/api/users/me/addresses')
        .set('x-user-id', userId)
        .send({ ...newAddr, isDefault: true });

      expect(res.status).toBe(201);
      expect(res.body.isDefault).toBe(true);
      expect(mockAddressUpdateMany).toHaveBeenCalledWith({
        where: { userId },
        data: { isDefault: false },
      });
    });
  });

  describe('PUT /api/users/me/addresses/:id', () => {
    const addressId = 'addr-1';
    const mockAddress = { id: addressId, userId, street: '123 St', isDefault: true };

    test('should return 404 if address does not exist or belongs to another user', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      mockAddressFindUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .put(`/api/users/me/addresses/${addressId}`)
        .set('x-user-id', userId)
        .send({ street: '456 St' });

      expect(res.status).toBe(404);
      expect(res.body.error).toContain('Address not found');
    });

    test('should update address fields', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      mockAddressFindUnique.mockResolvedValueOnce(mockAddress);
      mockAddressUpdate.mockResolvedValueOnce({ ...mockAddress, street: '456 St' });

      const res = await request(app)
        .put(`/api/users/me/addresses/${addressId}`)
        .set('x-user-id', userId)
        .send({ street: '456 St' });

      expect(res.status).toBe(200);
      expect(res.body.street).toBe('456 St');
    });

    test('should not allow unsetting default if it is the only address', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      mockAddressFindUnique.mockResolvedValueOnce(mockAddress);
      mockAddressFindFirst.mockResolvedValueOnce(null); // No other addresses
      mockAddressUpdate.mockResolvedValueOnce(mockAddress);

      const res = await request(app)
        .put(`/api/users/me/addresses/${addressId}`)
        .set('x-user-id', userId)
        .send({ isDefault: false });

      expect(res.status).toBe(200);
      expect(res.body.isDefault).toBe(true); // Forced to stay default
    });
  });

  describe('DELETE /api/users/me/addresses/:id', () => {
    const addressId = 'addr-1';
    const mockAddress = { id: addressId, userId, street: '123 St', isDefault: true };

    test('should delete address and make another address default if deleting current default', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      mockAddressFindUnique.mockResolvedValueOnce(mockAddress);
      mockAddressFindFirst.mockResolvedValueOnce({ id: 'addr-2', userId, street: '456 St', isDefault: false });

      const res = await request(app)
        .delete(`/api/users/me/addresses/${addressId}`)
        .set('x-user-id', userId);

      expect(res.status).toBe(200);
      expect(mockAddressUpdate).toHaveBeenCalledWith({
        where: { id: 'addr-2' },
        data: { isDefault: true },
      });
      expect(mockAddressDelete).toHaveBeenCalledWith({
        where: { id: addressId },
      });
    });
  });

  describe('POST /api/users/me/wishlist/:productId', () => {
    test('should add product to wishlist idempotently', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser); // for checkActiveUser
      mockUserUpdate.mockResolvedValueOnce({ ...mockUser, wishlist: ['prod-1', 'prod-2', 'prod-3'] });

      const res = await request(app)
        .post('/api/users/me/wishlist/prod-3')
        .set('x-user-id', userId);

      expect(res.status).toBe(200);
      expect(res.body).toContain('prod-3');
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: userId },
        data: { wishlist: ['prod-1', 'prod-2', 'prod-3'] },
      });
    });

    test('should not add duplicate product if already in wishlist', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);

      const res = await request(app)
        .post('/api/users/me/wishlist/prod-1')
        .set('x-user-id', userId);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(['prod-1', 'prod-2']);
      expect(mockUserUpdate).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/users/me/wishlist/:productId', () => {
    test('should remove product from wishlist idempotently', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser);
      mockUserUpdate.mockResolvedValueOnce({ ...mockUser, wishlist: ['prod-2'] });

      const res = await request(app)
        .delete('/api/users/me/wishlist/prod-1')
        .set('x-user-id', userId);

      expect(res.status).toBe(200);
      expect(res.body).not.toContain('prod-1');
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: userId },
        data: { wishlist: ['prod-2'] },
      });
    });
  });

  describe('PATCH /api/users/:id/role', () => {
    test('should return 403 if request is not from admin', async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}/role`)
        .set('x-user-role', 'customer')
        .send({ role: 'vendor' });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Admin access required');
    });

    test('should update target user role if requester is admin', async () => {
      mockUserFindUnique.mockResolvedValueOnce(mockUser); // to find target user
      mockUserUpdate.mockResolvedValueOnce({ ...mockUser, role: 'vendor' });

      const res = await request(app)
        .patch(`/api/users/${userId}/role`)
        .set('x-user-role', 'admin')
        .send({ role: 'vendor' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('vendor');
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: userId },
        data: { role: 'vendor' },
      });
    });
  });
});

