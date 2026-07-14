import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Get all products with filtering & search
app.get('/products', async (req, res) => {
  const { category, listingType, search, minPrice, maxPrice, createdBy } = req.query;

  try {
    const whereClause: any = {
      status: 'active',
    };

    if (category) {
      whereClause.category = String(category);
    }

    if (listingType) {
      whereClause.listingType = {
        in: [String(listingType), 'both'],
      };
    }

    if (createdBy) {
      whereClause.createdBy = String(createdBy);
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    // Filter by price (checks either salePrice or rentPricePerDay depending on query)
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(String(minPrice)) : 0;
      const max = maxPrice ? parseFloat(String(maxPrice)) : Infinity;
      
      whereClause.AND = [
        {
          OR: [
            { salePrice: { gte: min, lte: max } },
            { rentPricePerDay: { gte: min, lte: max } },
          ],
        },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (Admin or Vendor)
app.post('/products', async (req, res) => {
  const userRole = req.headers['x-user-role'] as string;
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (userRole !== 'admin' && userRole !== 'vendor') {
    return res.status(403).json({ error: 'Forbidden: Admin or Vendor role required' });
  }

  const {
    name,
    description,
    images,
    category,
    listingType,
    salePrice,
    saleStock,
    rentPricePerDay,
    rentPricePerWeek,
    rentDeposit,
    isCustomizable,
  } = req.body;

  if (!name || !category || !listingType) {
    return res.status(400).json({ error: 'Name, category, and listingType are required' });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        images: images || [],
        category,
        listingType,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        saleStock: saleStock ? parseInt(saleStock) : null,
        rentPricePerDay: rentPricePerDay ? parseFloat(rentPricePerDay) : null,
        rentPricePerWeek: rentPricePerWeek ? parseFloat(rentPricePerWeek) : null,
        rentDeposit: rentDeposit ? parseFloat(rentDeposit) : null,
        isCustomizable: !!isCustomizable,
        createdBy: userId,
        status: 'active',
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
app.put('/products/:id', async (req, res) => {
  const userRole = req.headers['x-user-role'] as string;
  const userId = req.headers['x-user-id'] as string;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Only creator vendor or admin can update product
    if (existingProduct.createdBy !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    const {
      name,
      description,
      images,
      category,
      listingType,
      salePrice,
      saleStock,
      rentPricePerDay,
      rentPricePerWeek,
      rentDeposit,
      isCustomizable,
      status,
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        images: images !== undefined ? images : existingProduct.images,
        category: category !== undefined ? category : existingProduct.category,
        listingType: listingType !== undefined ? listingType : existingProduct.listingType,
        salePrice: salePrice !== undefined ? (salePrice ? parseFloat(salePrice) : null) : existingProduct.salePrice,
        saleStock: saleStock !== undefined ? (saleStock ? parseInt(saleStock) : null) : existingProduct.saleStock,
        rentPricePerDay: rentPricePerDay !== undefined ? (rentPricePerDay ? parseFloat(rentPricePerDay) : null) : existingProduct.rentPricePerDay,
        rentPricePerWeek: rentPricePerWeek !== undefined ? (rentPricePerWeek ? parseFloat(rentPricePerWeek) : null) : existingProduct.rentPricePerWeek,
        rentDeposit: rentDeposit !== undefined ? (rentDeposit ? parseFloat(rentDeposit) : null) : existingProduct.rentDeposit,
        isCustomizable: isCustomizable !== undefined ? !!isCustomizable : existingProduct.isCustomizable,
        status: status !== undefined ? status : existingProduct.status,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete (archive) product
app.delete('/products/:id', async (req, res) => {
  const userRole = req.headers['x-user-role'] as string;
  const userId = req.headers['x-user-id'] as string;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (existingProduct.createdBy !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    // Soft delete by setting status to archived
    const product = await prisma.product.update({
      where: { id },
      data: { status: 'archived' },
    });

    res.json({ message: 'Product archived successfully', product });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Catalog Service running on port ${PORT}`);
});
