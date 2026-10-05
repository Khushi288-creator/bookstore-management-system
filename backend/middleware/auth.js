const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Ye middleware check karega ki request ke saath valid JWT token hai ya nahi
const protect = async (req, res, next) => {
  try {
    let token;

    // Token "Authorization: Bearer <token>" header mein aata hai
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User ko DB se nikalo (password ke bina) aur request object mein daal do
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user; // ab aage ke controllers mein req.user available hoga
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
  }
};

module.exports = { protect };
