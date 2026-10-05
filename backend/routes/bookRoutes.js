const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Public routes — koi bhi dekh sakta hai
router.get('/', getBooks);
router.get('/:id', getBookById);

// Admin-only routes — pehle protect (login check), phir authorize (role check)
router.post('/', protect, authorize('admin'), createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;
