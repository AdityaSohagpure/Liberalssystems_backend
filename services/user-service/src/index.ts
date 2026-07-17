import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/client';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Sync user from Firebase auth token (called by API Gateway)
app.post('/users/sync', async (req, res) => {
  const { firebaseUid, email, name, phone } = req.body;

  if (!firebaseUid) {
    return res.status(400).json({ error: 'firebaseUid is required' });
  }

  try {
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (user) {
      // Update existing user details if they changed and ensure active
      user = await prisma.user.update({
        where: { firebaseUid },
        data: {
          name: name || user.name,
          email: email || user.email,
          phone: phone || user.phone,
          isActive: true,
        },
      });
    } else {
      // Create new user (default role is customer)
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
          name: name || email.split('@')[0] || 'User',
          phone,
          role: 'customer',
          wishlist: [],
        },
      });
    }

    res.json({ id: user.id, role: user.role, firebaseUid: user.firebaseUid });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Internal server error during user sync' });
  }
});

// Get user profile (using header injected by Gateway)
app.get('/users/profile', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/users/profile', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { name, phone } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get wishlist
app.get('/users/wishlist', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { wishlist: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = JSON.parse(JSON.stringify(user.wishlist)) as string[];
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle wishlist item
app.post('/users/wishlist', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { productId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let wishlist = JSON.parse(JSON.stringify(user.wishlist)) as string[];
    if (!Array.isArray(wishlist)) wishlist = [];

    if (wishlist.includes(productId)) {
      // Remove
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      // Add
      wishlist.push(productId);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { wishlist },
    });

    res.json({ wishlist: updatedUser.wishlist });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add Address
app.post('/users/addresses', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { street, city, state, country, postalCode, isDefault } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  try {
    if (isDefault) {
      // Set all other addresses for this user to default = false
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        street,
        city,
        state,
        country,
        postalCode,
        isDefault: !!isDefault,
      },
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Address
app.delete('/users/addresses/:id', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const addressId = req.params.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to check if the user is active and exists
const checkActiveUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(404).json({ error: 'User profile is deactivated' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Error in checkActiveUser middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const apiRouter = express.Router();

// GET /api/users/me - Get current user's profile
apiRouter.get('/me', checkActiveUser, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/me - Update profile fields
apiRouter.put('/me', checkActiveUser, async (req, res) => {
  const userId = (req as any).user.id;
  const { name, phone } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/me - Soft delete (deactivate) profile
apiRouter.delete('/me', checkActiveUser, async (req, res) => {
  const userId = (req as any).user.id;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
    res.json({ message: 'User profile deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/me/addresses - List saved addresses
apiRouter.get('/me/addresses', checkActiveUser, async (req, res) => {
  const userId = (req as any).user.id;
  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
    });
    res.json(addresses);
  } catch (error) {
    console.error('Error listing addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/me/addresses - Add a new address
apiRouter.post('/me/addresses', checkActiveUser, async (req, res) => {
  const userId = (req as any).user.id;
  const { street, city, state, country, postalCode, isDefault } = req.body;

  if (!street || !city || !state || !country || !postalCode) {
    return res.status(400).json({ error: 'street, city, state, country, and postalCode are required' });
  }

  try {
    const addressCount = await prisma.address.count({
      where: { userId },
    });

    const shouldBeDefault = addressCount === 0 || !!isDefault;

    if (shouldBeDefault && addressCount > 0) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        street,
        city,
        state,
        country,
        postalCode,
        isDefault: shouldBeDefault,
      },
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/me/addresses/:id - Update an address
apiRouter.put('/me/addresses/:id', checkActiveUser, async (req, res) => {
  const userId = (req as any).user.id;
  const addressId = req.params.id;
  const { street, city, state, country, postalCode, isDefault } = req.body;

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      return res.status(404).json({ error: 'Address not found' });
    }

    let finalIsDefault = address.isDefault;
    if (isDefault !== undefined) {
      const newIsDefault = !!isDefault;
      if (newIsDefault !== address.isDefault) {
        if (newIsDefault) {
          await prisma.address.updateMany({
            where: { userId, id: { not: addressId } },
            data: { isDefault: false },
          });
          finalIsDefault = true;
        } else {
          // Cannot unset default if it is the only address
          const otherAddress = await prisma.address.findFirst({
            where: { userId, id: { not: addressId } },
          });
          if (otherAddress) {
            await prisma.address.update({
              where: { id: otherAddress.id },
              data: { isDefault: true },
            });
            finalIsDefault = false;
          } else {
            finalIsDefault = true; // Stay default if no other address
          }
        }
      }
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        street: street !== undefined ? street : address.street,
        city: city !== undefined ? city : address.city,
        state: state !== undefined ? state : address.state,
        country: country !== undefined ? country : address.country,
        postalCode: postalCode !== undefined ? postalCode : address.postalCode,
        isDefault: finalIsDefault,
      },
    });

    res.json(updatedAddress);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/me/addresses/:id - Remove an address
apiRouter.delete('/me/addresses/:id', checkActiveUser, async (req, res) => {
  const userId = (req as any).user.id;
  const addressId = req.params.id;

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      return res.status(404).json({ error: 'Address not found' });
    }

    if (address.isDefault) {
      const otherAddress = await prisma.address.findFirst({
        where: { userId, id: { not: addressId } },
      });
      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/me/wishlist/:productId - Add product to wishlist
apiRouter.post('/me/wishlist/:productId', checkActiveUser, async (req, res) => {
  const userId = (req as any).user.id;
  const { productId } = req.params;

  try {
    const user = (req as any).user;
    let wishlist = JSON.parse(JSON.stringify(user.wishlist)) as string[];
    if (!Array.isArray(wishlist)) wishlist = [];

    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { wishlist },
      });
      return res.json(updatedUser.wishlist);
    }

    res.json(wishlist);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/me/wishlist/:productId - Remove from wishlist
apiRouter.delete('/me/wishlist/:productId', checkActiveUser, async (req, res) => {
  const userId = (req as any).user.id;
  const { productId } = req.params;

  try {
    const user = (req as any).user;
    let wishlist = JSON.parse(JSON.stringify(user.wishlist)) as string[];
    if (!Array.isArray(wishlist)) wishlist = [];

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { wishlist },
      });
      return res.json(updatedUser.wishlist);
    }

    res.json(wishlist);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/users/:id/role - Admin: change a user's role
apiRouter.patch('/:id/role', async (req, res) => {
  const currentUserRole = req.headers['x-user-role'] as string;
  const targetUserId = req.params.id;
  const { role } = req.body;

  if (currentUserRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  const validRoles = ['customer', 'vendor', 'admin'];
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api/users', apiRouter);
app.use('/users', apiRouter);
app.use('/', apiRouter);

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
