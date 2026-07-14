import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/client';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:5003';

// Process and Charge Payment (Mocking Stripe/Razorpay)
app.post('/payments/charge', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { orderId, amount, type } = req.body; // type: "payment" | "deposit"

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!orderId || !amount || !type) {
    return res.status(400).json({ error: 'orderId, amount, and type are required' });
  }

  try {
    // Generate a mock gateway transaction reference
    const mockRefPrefix = type === 'deposit' ? 'dep_' : 'pay_';
    const gatewayRef = mockRefPrefix + Math.random().toString(36).substring(2, 12).toUpperCase();

    // 1. Log transaction in Payment DB as Success (Mock Checkout)
    const paymentRecord = await prisma.payment.create({
      data: {
        orderId,
        amount: parseFloat(amount),
        type,
        gatewayRef,
        status: 'success', // Auto-success in mock development mode
      },
    });

    // 2. If it's the primary order payment, notify the Order Service to finalize checkout
    if (type === 'payment') {
      try {
        await axios.post(`${orderServiceUrl}/orders/${orderId}/payment-complete`, {
          paymentId: paymentRecord.id,
        }, {
          headers: {
            'x-user-id': userId,
          }
        });
      } catch (err: any) {
        console.error('Failed to notify Order Service of payment completion:', err.message);
        // We still return the successful payment, but flag the callback warning
        return res.status(200).json({
          message: 'Payment succeeded but order status update callback failed',
          payment: paymentRecord,
          warning: err.message,
        });
      }
    }

    res.status(201).json({
      message: 'Payment processed successfully',
      payment: paymentRecord,
    });
  } catch (error) {
    console.error('Error processing charge:', error);
    res.status(500).json({ error: 'Internal server error during payment charge' });
  }
});

// Process Refund (Admin/Vendor only)
app.post('/payments/refund', async (req, res) => {
  const userRole = req.headers['x-user-role'] as string;
  const { orderId, amount, type } = req.body; // type: "refund"

  if (userRole !== 'admin' && userRole !== 'vendor') {
    return res.status(403).json({ error: 'Forbidden: Admin or Vendor role required' });
  }

  if (!orderId || !amount) {
    return res.status(400).json({ error: 'orderId and amount are required' });
  }

  try {
    const gatewayRef = 'ref_' + Math.random().toString(36).substring(2, 12).toUpperCase();

    const refundRecord = await prisma.payment.create({
      data: {
        orderId,
        amount: parseFloat(amount),
        type: type || 'refund',
        gatewayRef,
        status: 'success',
      },
    });

    res.status(201).json({
      message: 'Refund recorded successfully',
      refund: refundRecord,
    });
  } catch (error) {
    console.error('Error logging refund:', error);
    res.status(500).json({ error: 'Internal server error logging refund' });
  }
});

// GET Transactions for an order
app.get('/payments/order/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const payments = await prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
