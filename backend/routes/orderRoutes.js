const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validateRequest } = require('../middleware/validateRequest');
const {
  createOrderRules,
  orderIdParamRules,
  updateOrderStatusRules,
  listOrdersQueryRules,
} = require('../validators/orderValidators');

router.post('/', protect, createOrderRules, validateRequest, createOrder);
router.get('/my', protect, listOrdersQueryRules, validateRequest, getMyOrders);
router.get('/', protect, authorize('admin'), listOrdersQueryRules, validateRequest, getOrders);
router.get('/:id', protect, orderIdParamRules, validateRequest, getOrderById);
router.put('/:id/cancel', protect, orderIdParamRules, validateRequest, cancelOrder);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatusRules, validateRequest, updateOrderStatus);

module.exports = router;
