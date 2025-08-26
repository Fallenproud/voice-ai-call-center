import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { licenseRoutes } from './routes/license';
import { errorHandler } from './middleware/errorHandler';

config();

const app = express();
const port = process.env.LICENSE_SERVER_PORT || 3002;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Velora Voice™ License Server',
    version: '1.0.0',
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/api/license', licenseRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'The requested resource was not found on this server.' 
  });
});

app.listen(port, () => {
  console.log(`🔐 Velora Voice™ License Server running on: http://localhost:${port}`);
  console.log(`🩺 Health check: http://localhost:${port}/health`);
});

export default app;