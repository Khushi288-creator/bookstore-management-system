// Usage: adminOnly() ya authorize('admin', 'customer') dono tarike se use kar sakte ho
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not allowed to perform this action`,
      });
    }

    next();
  };
};

module.exports = { authorize };
