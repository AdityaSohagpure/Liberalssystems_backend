import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/client';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const catalogServiceUrl = process.env.CATALOG_SERVICE_URL || 'http://localhost:5002';
const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004';

import { getDurationInDays, calculateRentCost } from './utils/pricing';

// Check availability function
async function checkOverlap(productId: string, start: Date, end: Date): Promise<boolean> {
  const overlaps = await prisma.rentalCalendar.findFirst({
    where: {
      productId,
      OR: [
        {
          rentStart: { lte: start },
          rentEnd: { gte: start },
        },
        {
          rentStart: { lte: end },
          rentEnd: { gte: end },
        },
        {
          rentStart: { gte: start },
          rentEnd: { lte: end },
        },
      ],
    },
  });
  return !!overlaps;
}

// Check availability endpoint
app.get('/orders/check-availability', async (req, res) => {
  const { productId, rentStart, rentEnd } = req.query;

  if (!productId || !rentStart || !rentEnd) {
    return res.status(400).json({ error: 'productId, rentStart, and rentEnd are required' });
  }

  try {
    const start = new Date(String(rentStart));
    const end = new Date(String(rentEnd));

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ error: 'Invalid start or end dates' });
    }

    const isBooked = await checkOverlap(String(productId), start, end);
    res.json({ available: !isBooked });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET Cart items for a user
app.get('/orders/cart', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST Add item to Cart
app.post(['/orders/cart', '/orders/cart/items'], async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { productId, type, quantity, rentStart, rentEnd } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  if (!productId || !type) {
    return res.status(400).json({ error: 'productId and type are required' });
  }

  if (type !== 'sale' && type !== 'rent') {
    return res.status(400).json({ error: 'type must be sale or rent' });
  }

  try {
    // 1. Fetch product details from Catalog Service
    let productDetails;
    try {
      const response = await axios.get(`${catalogServiceUrl}/products/${productId}`);
      productDetails = response.data;
    } catch (err: any) {
      return res.status(404).json({ error: 'Product not found in catalog' });
    }

    // 2. Validate product matches requested type
    if (productDetails.listingType !== type && productDetails.listingType !== 'both') {
      return res.status(400).json({ error: `Product is not listed for ${type}` });
    }

    let parsedStart: Date | null = null;
    let parsedEnd: Date | null = null;

    if (type === 'rent') {
      if (!rentStart || !rentEnd) {
        return res.status(400).json({ error: 'rentStart and rentEnd are required for rent items' });
      }

      parsedStart = new Date(rentStart);
      parsedEnd = new Date(rentEnd);

      if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime()) || parsedStart >= parsedEnd) {
        return res.status(400).json({ error: 'Invalid rental date ranges' });
      }

      // Check dates availability
      const isBooked = await checkOverlap(productId, parsedStart, parsedEnd);
      if (isBooked) {
        return res.status(400).json({ error: 'Product is already rented/booked for these dates' });
      }
    }

    const qty = quantity ? parseInt(quantity) : 1;

    // 3. Save to Cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        type,
        rentStart: parsedStart,
        rentEnd: parsedEnd,
      },
    });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + qty },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          type,
          quantity: qty,
          rentStart: parsedStart,
          rentEnd: parsedEnd,
        },
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE Cart item
app.delete(['/orders/cart/:id', '/orders/cart/items/:id'], async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const item = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!item || item.userId !== userId) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Checkout Cart & Create Pending Order
app.post('/orders/checkout', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { deliveryAddress } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!deliveryAddress) {
    return res.status(400).json({ error: 'deliveryAddress is required' });
  }

  try {
    // 1. Fetch user cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let orderType = 'sale';
    let hasSale = false;
    let hasRent = false;
    let totalDeposit = 0;
    let totalAmount = 0;
    const checkoutItems: any[] = [];
    const calendarReservations: any[] = [];

    // 2. Validate and price each item
    for (const item of cartItems) {
      // Fetch product details
      let product;
      try {
        const response = await axios.get(`${catalogServiceUrl}/products/${item.productId}`);
        product = response.data;
      } catch (err) {
        return res.status(404).json({ error: `Product ${item.productId} not found in catalog` });
      }

      if (item.type === 'sale') {
        hasSale = true;
        if (!product.salePrice) {
          return res.status(400).json({ error: `Product ${product.name} is not available for sale` });
        }
        if (product.saleStock !== null && product.saleStock < item.quantity) {
          return res.status(400).json({ error: `Product ${product.name} is out of stock` });
        }

        const itemCost = product.salePrice * item.quantity;
        totalAmount += itemCost;
        checkoutItems.push({
          productId: item.productId,
          type: 'sale',
          price: product.salePrice,
          quantity: item.quantity,
        });
      } else if (item.type === 'rent') {
        hasRent = true;
        if (!product.rentPricePerDay) {
          return res.status(400).json({ error: `Product ${product.name} is not available for rent` });
        }

        const start = item.rentStart!;
        const end = item.rentEnd!;

        // Double check calendar availability
        const isBooked = await checkOverlap(item.productId, start, end);
        if (isBooked) {
          return res.status(400).json({ error: `Product ${product.name} is no longer available for requested rental dates` });
        }

        const durationDays = getDurationInDays(start, end);
        const singleRentPrice = calculateRentCost(product.rentPricePerDay, product.rentPricePerWeek, durationDays);
        const itemCost = singleRentPrice * item.quantity;
        const itemDeposit = (product.rentDeposit || 0) * item.quantity;

        totalAmount += itemCost;
        totalDeposit += itemDeposit;

        checkoutItems.push({
          productId: item.productId,
          type: 'rent',
          price: singleRentPrice,
          quantity: item.quantity,
          rentStart: start,
          rentEnd: end,
          returnStatus: 'not_returned',
        });

        // Track calendar items to book
        calendarReservations.push({
          productId: item.productId,
          rentStart: start,
          rentEnd: end,
        });
      }
    }

    if (hasSale && hasRent) {
      orderType = 'mixed';
    } else if (hasRent) {
      orderType = 'rent';
    }

    // 3. Create order transaction in DB
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderType,
          deliveryAddress,
          status: 'pending',
          deposit: totalDeposit,
          items: {
            create: checkoutItems.map(item => ({
              productId: item.productId,
              type: item.type,
              price: item.price,
              quantity: item.quantity,
              rentStart: item.rentStart,
              rentEnd: item.rentEnd,
              returnStatus: item.returnStatus,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Reserve rental slots in calendar
      for (const res of calendarReservations) {
        // Find matching item we just created
        const createdItem = newOrder.items.find(i => i.productId === res.productId && i.type === 'rent');
        await tx.rentalCalendar.create({
          data: {
            productId: res.productId,
            orderItemId: createdItem?.id,
            rentStart: res.rentStart,
            rentEnd: res.rentEnd,
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    res.status(201).json({
      message: 'Order created successfully. Proceed to payment.',
      order,
      totalBilling: totalAmount + totalDeposit,
      rentAmount: totalAmount - (orderType === 'sale' ? totalAmount : 0),
      depositAmount: totalDeposit,
    });
  } catch (error) {
    console.error('Error checking out:', error);
    res.status(500).json({ error: 'Internal server error during checkout' });
  }
});

// Mark Payment Completed (Called internally by Payment Service)
app.post('/orders/:id/payment-complete', async (req, res) => {
  const { id } = req.params;
  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: `Order is already in status: ${order.status}` });
    }

    // Update order status and record paymentId
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'paid',
        paymentId,
      },
    });

    // Reduce stock for sale items if applicable
    for (const item of order.items) {
      if (item.type === 'sale') {
        try {
          // Put update to Catalog Service to reduce stock
          // Catalog Service GET product
          const prodRes = await axios.get(`${catalogServiceUrl}/products/${item.productId}`);
          const prod = prodRes.data;
          if (prod.saleStock !== null) {
            const newStock = Math.max(0, prod.saleStock - item.quantity);
            await axios.put(`${catalogServiceUrl}/products/${item.productId}`, {
              saleStock: newStock,
            });
          }
        } catch (err: any) {
          console.error(`Failed to update stock for product ${item.productId}:`, err.message);
        }
      }
    }

    res.json({ message: 'Order marked as paid successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error completing order payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Custom Order (Converted from Custom Request)
app.post(['/orders/custom', '/internal/orders/from-custom-request'], async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { customRequestId, quotePrice, deliveryAddress, productCategory } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  if (!customRequestId || quotePrice === undefined || !deliveryAddress) {
    return res.status(400).json({ error: 'customRequestId, quotePrice, and deliveryAddress are required' });
  }

  try {
    const newOrder = await prisma.order.create({
      data: {
        userId,
        orderType: 'custom',
        deliveryAddress,
        status: 'pending',
        deposit: 0.0,
        customRequestId,
        items: {
          create: [
            {
              productId: `custom-request-${productCategory.toLowerCase().replace(/\s+/g, '-')}`,
              type: 'sale', // Custom requests are purchased as sales
              price: parseFloat(quotePrice),
              quantity: 1,
            }
          ]
        }
      },
      include: {
        items: true,
      }
    });

    res.status(201).json({
      message: 'Custom request order created',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating custom request order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET Order history
app.get('/orders', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let orders;

    // Admins can see all orders, customers see only their own
    if (userRole === 'admin') {
      orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET Single Order details
app.get('/orders/:id', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT Update Rental return status (Admin/Vendor only)
app.put('/orders/items/:itemId/return', async (req, res) => {
  const userRole = req.headers['x-user-role'] as string;
  const { itemId } = req.params;
  const { returnStatus } = req.body; // "returned_ok" | "returned_damaged" | "not_returned"

  if (userRole !== 'admin' && userRole !== 'vendor') {
    return res.status(403).json({ error: 'Forbidden: Admin or Vendor credentials required' });
  }

  if (!['returned_ok', 'returned_damaged', 'not_returned'].includes(returnStatus)) {
    return res.status(400).json({ error: 'Invalid return status value' });
  }

  try {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemId },
    });

    if (!orderItem || orderItem.type !== 'rent') {
      return res.status(404).json({ error: 'Rental order item not found' });
    }

    const updatedItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { returnStatus },
    });

    // If item is returned, we can release it in the RentalCalendar (delete the booking slot or mark it available)
    if (returnStatus === 'returned_ok' || returnStatus === 'returned_damaged') {
      await prisma.rentalCalendar.deleteMany({
        where: { orderItemId: itemId },
      });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating rental return status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT Update Cart Item quantity or dates
app.put('/orders/cart/items/:id', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { id } = req.params;
  const { quantity, rentStart, rentEnd } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const updateData: any = {};
    if (quantity !== undefined) {
      updateData.quantity = parseInt(quantity);
    }

    if (cartItem.type === 'rent') {
      if (rentStart || rentEnd) {
        const start = new Date(rentStart || cartItem.rentStart!);
        const end = new Date(rentEnd || cartItem.rentEnd!);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
          return res.status(400).json({ error: 'Invalid rental date ranges' });
        }

        // Check availability
        const isBooked = await checkOverlap(cartItem.productId, start, end);
        if (isBooked) {
          return res.status(400).json({ error: 'Product is already rented/booked for these dates' });
        }

        updateData.rentStart = start;
        updateData.rentEnd = end;
      }
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST Add item to Cart from Wishlist (Like to Cart)
app.post(['/orders/cart/from-wishlist', '/orders/cart/items/from-wishlist'], async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { productId, type, quantity, rentStart, rentEnd } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  try {
    // 1. Fetch user's wishlist from User Service
    const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5001';
    let wishlist: string[] = [];
    try {
      const response = await axios.get(`${userServiceUrl}/users/wishlist`, {
        headers: { 'x-user-id': userId }
      });
      wishlist = response.data;
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch user wishlist from User Service' });
    }

    // 2. Verify product is in user's wishlist
    if (!wishlist.includes(productId)) {
      return res.status(400).json({ error: 'Product is not in your wishlist' });
    }

    // 3. Fetch product details from Catalog Service
    let productDetails;
    try {
      const response = await axios.get(`${catalogServiceUrl}/products/${productId}`);
      productDetails = response.data;
    } catch (err: any) {
      return res.status(404).json({ error: 'Product not found in catalog' });
    }

    // 4. Determine listing type to add to cart
    const finalType = type || (productDetails.listingType === 'rent' ? 'rent' : 'sale');

    if (finalType !== 'sale' && finalType !== 'rent') {
      return res.status(400).json({ error: 'Invalid item type' });
    }

    if (productDetails.listingType !== finalType && productDetails.listingType !== 'both') {
      return res.status(400).json({ error: `Product is not listed for ${finalType}` });
    }

    let parsedStart: Date | null = null;
    let parsedEnd: Date | null = null;

    if (finalType === 'rent') {
      if (!rentStart || !rentEnd) {
        return res.status(400).json({ error: 'rentStart and rentEnd are required to add rental item from wishlist' });
      }

      parsedStart = new Date(rentStart);
      parsedEnd = new Date(rentEnd);

      if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime()) || parsedStart >= parsedEnd) {
        return res.status(400).json({ error: 'Invalid rental date ranges' });
      }

      // Check dates availability
      const isBooked = await checkOverlap(productId, parsedStart, parsedEnd);
      if (isBooked) {
        return res.status(400).json({ error: 'Product is already rented/booked for these dates' });
      }
    }

    const qty = quantity ? parseInt(quantity) : 1;

    // 5. Save to Cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        type: finalType,
        rentStart: parsedStart,
        rentEnd: parsedEnd,
      },
    });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + qty },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          type: finalType,
          quantity: qty,
          rentStart: parsedStart,
          rentEnd: parsedEnd,
        },
      });
    }

    // 6. Toggle wishlist to remove the item after adding it to the cart
    try {
      await axios.post(`${userServiceUrl}/users/wishlist`, { productId }, {
        headers: { 'x-user-id': userId }
      });
    } catch (err: any) {
      console.warn('Failed to remove item from wishlist after adding to cart:', err.message);
    }

    res.status(201).json({
      message: 'Item successfully moved from wishlist to cart',
      cartItem
    });
  } catch (error) {
    console.error('Error adding from wishlist to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH Update Order Status (Admin/Vendor only)
app.patch('/orders/:id/status', async (req, res) => {
  const userRole = req.headers['x-user-role'] as string;
  const { id } = req.params;
  const { status } = req.body;

  if (userRole !== 'admin' && userRole !== 'vendor') {
    return res.status(403).json({ error: 'Forbidden: Vendor or Admin role required' });
  }

  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH Update Rental Return Status (Admin/Vendor only)
app.patch('/orders/:id/items/:itemId/return', async (req, res) => {
  const userRole = req.headers['x-user-role'] as string;
  const { itemId } = req.params;
  const { returnStatus } = req.body; // "returned_ok" | "returned_damaged" | "not_returned"

  if (userRole !== 'admin' && userRole !== 'vendor') {
    return res.status(403).json({ error: 'Forbidden: Admin or Vendor credentials required' });
  }

  if (!['returned_ok', 'returned_damaged', 'not_returned'].includes(returnStatus)) {
    return res.status(400).json({ error: 'Invalid return status value' });
  }

  try {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemId },
    });

    if (!orderItem || orderItem.type !== 'rent') {
      return res.status(404).json({ error: 'Rental order item not found' });
    }

    const updatedItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { returnStatus },
    });

    // If item is returned, we can release it in the RentalCalendar
    if (returnStatus === 'returned_ok' || returnStatus === 'returned_damaged') {
      await prisma.rentalCalendar.deleteMany({
        where: { orderItemId: itemId },
      });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating rental return status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET Product Availability (Public) - blocked rental date ranges
app.get('/orders/products/:id/availability', async (req, res) => {
  const { id } = req.params;
  try {
    const calendar = await prisma.rentalCalendar.findMany({
      where: { productId: id },
      select: { rentStart: true, rentEnd: true },
      orderBy: { rentStart: 'asc' },
    });
    res.json(calendar);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
