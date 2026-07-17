import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));

// JSON parsing only for direct Gateway requests (like health check)
// Downstream proxy routes shouldn't be body-parsed by Gateway to avoid breaking file uploads and streams
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

// Configure services mapping
const services = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:5001',
  catalog: process.env.CATALOG_SERVICE_URL || 'http://localhost:5002',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:5003',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004',
  customRequest: process.env.CUSTOM_REQUEST_SERVICE_URL || 'http://localhost:5005',
};

// Apply token verification middleware
app.use(authenticateToken);

// Create proxy options that forwards the custom headers and appends path prefix
const createProxyOpts = (target: string, pathPrefix: string): Options => ({
  target,
  changeOrigin: true,
  pathRewrite: (path) => pathPrefix + path,
  on: {
    proxyReq: (proxyReq, req: any) => {
      // Forward authentication headers from gateway to downstream services
      if (req.headers['x-user-id']) {
        proxyReq.setHeader('x-user-id', req.headers['x-user-id'] as string);
      }
      if (req.headers['x-user-role']) {
        proxyReq.setHeader('x-user-role', req.headers['x-user-role'] as string);
      }
      if (req.headers['x-user-firebase-uid']) {
        proxyReq.setHeader('x-user-firebase-uid', req.headers['x-user-firebase-uid'] as string);
      }
    }
  }
});

// Specific route for Product Availability (handled by Order Service)
app.use(createProxyMiddleware({
  target: services.order,
  changeOrigin: true,
  pathFilter: (path) => /^\/api\/products\/[^\/]+\/availability$/.test(path),
  pathRewrite: (path) => {
    const match = path.match(/^\/api\/products\/([^\/]+)\/availability$/);
    return match ? `/orders/products/${match[1]}/availability` : path;
  },
  on: {
    proxyReq: (proxyReq, req: any) => {
      if (req.headers['x-user-id']) {
        proxyReq.setHeader('x-user-id', req.headers['x-user-id'] as string);
      }
      if (req.headers['x-user-role']) {
        proxyReq.setHeader('x-user-role', req.headers['x-user-role'] as string);
      }
      if (req.headers['x-user-firebase-uid']) {
        proxyReq.setHeader('x-user-firebase-uid', req.headers['x-user-firebase-uid'] as string);
      }
    }
  }
}));

// Route mapping
app.use('/api/users', createProxyMiddleware(createProxyOpts(services.user)));
app.use('/api/products', createProxyMiddleware(createProxyOpts(services.catalog)));
app.use('/api/orders', createProxyMiddleware(createProxyOpts(services.order)));
app.use('/api/payments', createProxyMiddleware(createProxyOpts(services.payment)));
app.use('/api/admin/custom-requests', createProxyMiddleware({
  ...createProxyOpts(services.customRequest),
  pathRewrite: (path) => `/api/admin/custom-requests${path}`
}));
app.use('/api/custom-requests', createProxyMiddleware({
  ...createProxyOpts(services.customRequest),
  pathRewrite: (path) => `/api/custom-requests${path}`
}));
app.use('/api/users', createProxyMiddleware(createProxyOpts(services.user, '/users')));
app.use('/api/products', createProxyMiddleware(createProxyOpts(services.catalog, '/products')));
app.use('/api/cart', createProxyMiddleware(createProxyOpts(services.order, '/orders/cart')));
app.use('/api/orders', createProxyMiddleware(createProxyOpts(services.order, '/orders')));
app.use('/api/payments', createProxyMiddleware(createProxyOpts(services.payment, '/payments')));
app.use('/api/custom-requests', createProxyMiddleware(createProxyOpts(services.customRequest, '/custom-requests')));

// Fallback route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found at Gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
