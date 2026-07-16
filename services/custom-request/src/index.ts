import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/client';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:5003';

// 1. Submit a new custom request
app.post('/api/custom-requests', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { productCategory, description, budgetRange, referenceImages } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  if (!productCategory || !description || !budgetRange) {
    return res.status(400).json({ error: 'productCategory, description, and budgetRange are required' });
  }

  try {
    const customRequest = await prisma.customRequest.create({
      data: {
        userId,
        productCategory,
        description,
        budgetRange,
        referenceImages: referenceImages || [],
        status: 'pending',
      },
    });

    res.status(201).json(customRequest);
  } catch (error) {
    console.error('Error creating custom request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. List current user's requests
app.get('/api/custom-requests', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  try {
    const requests = await prisma.customRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching custom requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Get admin queue of pending requests (Admin only)
app.get('/api/admin/custom-requests', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin role required' });
  }

  try {
    const requests = await prisma.customRequest.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching admin custom requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Get request detail
app.get('/api/custom-requests/:id', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  try {
    const request = await prisma.customRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({ error: 'Custom request not found' });
    }

    if (request.userId !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching custom request details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Admin submits a quote
app.patch('/api/custom-requests/:id/quote', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const { id } = req.params;
  const { price, eta, notes } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  if (userRole !== 'admin' && userRole !== 'vendor') {
    return res.status(403).json({ error: 'Forbidden: Admin or Vendor role required' });
  }

  if (price === undefined || !eta) {
    return res.status(400).json({ error: 'price and eta are required' });
  }

  try {
    const request = await prisma.customRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({ error: 'Custom request not found' });
    }

    if (request.status !== 'pending' && request.status !== 'quoted') {
      return res.status(400).json({ error: `Cannot quote custom request in status: ${request.status}` });
    }

    const updatedRequest = await prisma.customRequest.update({
      where: { id },
      data: {
        adminQuotePrice: parseFloat(price),
        adminQuoteEta: eta,
        adminQuoteNotes: notes || '',
        status: 'quoted',
      },
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error submitting quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 6. Customer responds to quote (accept/reject)
app.patch('/api/custom-requests/:id/respond', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { id } = req.params;
  const { response, deliveryAddress } = req.body; // response: "accept" | "reject"

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  if (!response || !['accept', 'reject'].includes(response)) {
    return res.status(400).json({ error: 'response must be accept or reject' });
  }

  try {
    const request = await prisma.customRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({ error: 'Custom request not found' });
    }

    if (request.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this request' });
    }

    if (request.status !== 'quoted') {
      return res.status(400).json({ error: `Custom request status must be quoted, current is: ${request.status}` });
    }

    if (response === 'reject') {
      const updatedRequest = await prisma.customRequest.update({
        where: { id },
        data: { status: 'rejected' },
      });
      return res.json(updatedRequest);
    }

    // response === 'accept'
    if (!deliveryAddress) {
      return res.status(400).json({ error: 'deliveryAddress is required to accept the quote' });
    }

    if (!request.adminQuotePrice) {
      return res.status(400).json({ error: 'Approved quote lacks pricing details' });
    }

    // Set state to approved first
    await prisma.customRequest.update({
      where: { id },
      data: { status: 'approved' },
    });

    // Call Order Service to create custom order
    let orderResponse;
    try {
      orderResponse = await axios.post(`${orderServiceUrl}/orders/custom`, {
        customRequestId: request.id,
        quotePrice: request.adminQuotePrice,
        deliveryAddress,
        productCategory: request.productCategory,
      }, {
        headers: {
          'x-user-id': userId,
        }
      });
    } catch (err: any) {
      console.error('Failed to create order in Order Service:', err.response?.data || err.message);
      // Revert status to approved/quoted or return error
      return res.status(500).json({ 
        error: 'Failed to create converted order in Order Service',
        details: err.response?.data || err.message
      });
    }

    const { order } = orderResponse.data;

    // Update status to converted and record the convertedOrderId
    const updatedRequest = await prisma.customRequest.update({
      where: { id },
      data: {
        status: 'converted',
        convertedOrderId: order.id,
      },
    });

    res.json({
      message: 'Custom request approved and converted to order successfully',
      customRequest: updatedRequest,
      order,
    });
  } catch (error) {
    console.error('Error responding to quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Custom Request Service running on port ${PORT}`);
});
