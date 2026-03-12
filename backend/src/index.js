require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initSocket } = require('./socket/locationHandler');

// Routes
const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/buses');
const tripRoutes = require('./routes/trips');
// ... other routes

const app = express();
const server = http.createServer(app);

// Middleware
// Disabled helmet completely to avoid any devtools or CSP errors right now
// app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', apiLimiter);

// Initialize Socket.io
initSocket(server);

// Base route test
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Setup API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 5000;

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception thrown:', err);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Backend] Server successfully started and listening on port ${PORT}`);
  console.log(`[Backend] Service URL: ${process.env.RENDER_EXTERNAL_URL || 'localhost'}`);
});
