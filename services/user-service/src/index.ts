import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/client';

dotenv.config();

const app = express();
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
      // Update existing user details if they changed
      user = await prisma.user.update({
        where: { firebaseUid },
        data: {
          name: name || user.name,
          email: email || user.email,
          phone: phone || user.phone,
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

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
