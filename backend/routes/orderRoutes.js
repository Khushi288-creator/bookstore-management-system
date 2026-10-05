const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Sab routes login required hain (protect sabse pehle)
router.post('/', protect, createOrder); // customer order place kare
router.get('/', protect, authorize('admin'), getOrders); // sirf admin sab orders dekhe
router.get('/:id', protect, getOrderById); // apna order ya admin
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus); // sirf admin status update kare

module.exports = router;
