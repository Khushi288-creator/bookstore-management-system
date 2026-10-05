require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Database connect karo
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // JSON body parse karne ke liye

// Health check route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bookstore Management System API is running' });
});

// Routes
app.use('/api', authRoutes); // /api/register, /api/login
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

// 404 + Error handling (hamesha sabse last mein)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
