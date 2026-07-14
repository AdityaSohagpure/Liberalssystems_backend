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

// Create a Custom Product Request (User)
app.post('/custom-requests', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { productCategory, description, budgetRange, referenceImages } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
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

// GET Custom Requests (Admin gets all, Customer gets their own)
app.get('/custom-requests', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let requests;
    if (userRole === 'admin') {
      requests = await prisma.customRequest.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } else {
      requests = await prisma.customRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json(requests);
  } catch (error) {
    console.error('Error fetching custom requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET Single Custom Request
app.get('/custom-requests/:id', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const request = await prisma.customRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({ error: 'Custom request not found' });
    }

    if (request.userId !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching custom request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Quote a Custom Request (Admin only)
app.post('/custom-requests/:id/quote', async (req, res) => {
  const userRole = req.headers['x-user-role'] as string;
  const { id } = req.params;
  const { price, eta, notes } = req.body;

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

// Respond to Quote (User accepts/rejects)
app.post('/custom-requests/:id/respond', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { id } = req.params;
  const { response } = req.body; // "accept" | "reject"

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!response || !['accept', 'reject'].includes(response)) {
    return res.status(400).json({ error: 'response must be accept or reject' });
  }

  try {
    const request = await prisma.customRequest.findUnique({
      where: { id },
    });

    if (!request || request.userId !== userId) {
      return res.status(404).json({ error: 'Custom request not found' });
    }

    if (request.status !== 'quoted') {
      return res.status(400).json({ error: 'Custom request has not been quoted yet' });
    }

    const newStatus = response === 'accept' ? 'approved' : 'rejected';

    const updatedRequest = await prisma.customRequest.update({
      where: { id },
      data: { status: newStatus },
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error responding to quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Convert Custom Request to Order (User accepts & creates order)
app.post('/custom-requests/:id/convert', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { id } = req.params;
  const { deliveryAddress } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!deliveryAddress) {
    return res.status(400).json({ error: 'deliveryAddress is required' });
  }

  try {
    const request = await prisma.customRequest.findUnique({
      where: { id },
    });

    if (!request || request.userId !== userId) {
      return res.status(404).json({ error: 'Custom request not found' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ error: 'Custom request must be approved first before converting' });
    }

    if (!request.adminQuotePrice) {
      return res.status(400).json({ error: 'Approved quote lacks pricing details' });
    }

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
      return res.status(500).json({ error: 'Failed to create converted order in Order Service' });
    }

    const { order } = orderResponse.data;

    // Update custom request status to converted and log order ID
    const updatedRequest = await prisma.customRequest.update({
      where: { id },
      data: {
        status: 'converted',
        convertedOrderId: order.id,
      },
    });

    res.json({
      message: 'Custom request converted to order successfully',
      customRequest: updatedRequest,
      order,
    });
  } catch (error) {
    console.error('Error converting custom request to order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Custom Request Service running on port ${PORT}`);
});
