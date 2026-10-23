const mongoose = require('mongoose');
const Order = require('../models/Order');
const Book = require('../models/Book');

const restoreOrderStock = async (order, session) => {
  for (const item of order.items) {
    await Book.findByIdAndUpdate(item.book, { $inc: { stock: item.quantity } }, { session });
  }
};

const CANCELLABLE_STATUSES = ['pending', 'processing'];

// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = req.body;
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.book).session(session);
      if (!book) {
        await session.abortTransaction();
        return res.status(404).json({ success: false, message: `Book not found: ${item.book}` });
      }

      const updatedBook = await Book.findOneAndUpdate(
        { _id: item.book, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );

      if (!updatedBook) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${book.title}"`,
        });
      }

      orderItems.push({ book: book._id, quantity: item.quantity, price: book.price });
      totalPrice += book.price * item.quantity;
    }

    const [order] = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          totalPrice,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const populated = await Order.findById(order._id)
      .populate('items.book', 'title author price stock');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populated,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @route   GET /api/orders/my
// @access  Private (logged-in user's orders)
const getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.book', 'title author price')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .populate('items.book', 'title author price')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/orders/:id
// @access  Private (owner or admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.book', 'title author price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied to this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/orders/:id/cancel
// @access  Private (owner or admin)
const cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      await session.abortTransaction();
      return res.status(403).json({ success: false, message: 'Access denied to this order' });
    }

    if (order.status === 'cancelled') {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status "${order.status}"`,
      });
    }

    await restoreOrderStock(order, session);
    order.status = 'cancelled';
    await order.save({ session });

    await session.commitTransaction();

    const populated = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.book', 'title author price stock');

    res.status(200).json({
      success: true,
      message: 'Order cancelled and stock restored',
      data: populated,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.status;

    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      if (!CANCELLABLE_STATUSES.includes(previousStatus)) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Only pending or processing orders can be marked cancelled',
        });
      }
      await restoreOrderStock(order, session);
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save({ session });
    await session.commitTransaction();

    const populated = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.book', 'title author price stock');

    res.status(200).json({ success: true, message: 'Order status updated', data: populated });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};
