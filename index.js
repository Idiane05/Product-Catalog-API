require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
const productRoutes = require('./routes/productRoutes');
const User = require('./models/User');  // Import User model
const jwt = require('jsonwebtoken');    // Import JWT library


// Log the Mongo URI to make sure it's loaded
console.log('Mongo URI:', process.env.MONGO_URI);

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Product Catalog API is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

app.use('/api/products', productRoutes);

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Create new user
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      // Generate a JWT token
      const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.status(201).json({ token });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error registering user' });
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Compare the password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error logging in' });
    }
  });

  // Middleware to protect routes
  const protect = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  // Extract token from Authorization header
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');  // Verify the token using the secret key
      req.user = decoded;  // Attach user info to the request object
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  app.post('/products', protect, (req, res) => {
    // Product creation logic here
    // Only users with a valid JWT token can access this route
  });