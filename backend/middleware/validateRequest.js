const { validationResult } = require('express-validator');

// Route pe validators lagane ke baad ye middleware errors check karta hai
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((err) => err.msg).join(', ');
    return res.status(400).json({
      success: false,
      message,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = { validateRequest };
