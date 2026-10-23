const { body, param, query } = require('express-validator');

const createOrderRules = [
  body('items').isArray({ min: 1 }).withMessage('Order must include at least one item'),
  body('items.*.book').isMongoId().withMessage('Each item must have a valid book id'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const orderIdParamRules = [param('id').isMongoId().withMessage('Invalid order id')];

const updateOrderStatusRules = [
  param('id').isMongoId().withMessage('Invalid order id'),
  body('status')
    .optional()
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('paymentStatus')
    .optional()
    .isIn(['unpaid', 'paid', 'refunded'])
    .withMessage('Invalid payment status'),
];

const listOrdersQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status filter'),
];

module.exports = {
  createOrderRules,
  orderIdParamRules,
  updateOrderStatusRules,
  listOrdersQueryRules,
};
