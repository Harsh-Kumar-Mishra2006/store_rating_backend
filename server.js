require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const seedSuperAdmin = require('./scripts/seedSuperAdmin');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoute');

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log(' Database connection established successfully.');
    
    await sequelize.sync({ force: false });
    console.log(' Database synchronized');
    
    await seedSuperAdmin();
    
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Unable to start server:', error);
    process.exit(1);
  }
}

startServer();