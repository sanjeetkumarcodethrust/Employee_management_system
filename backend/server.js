import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initStore } from './data/store.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Employee Management System API',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Employee Management System Backend is running. Access APIs via /api/...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start listening immediately
app.listen(PORT, () => {
  console.log(`[Server] EMS Backend server listening on http://localhost:${PORT}`);
});

// Initialize DB and Store
initStore();
connectDB().catch((err) => {
  console.warn('[Database] Initial connection note:', err.message);
});
