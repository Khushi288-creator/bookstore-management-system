const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { validateRequest } = require('../middleware/validateRequest');
const {
  createBookRules,
  updateBookRules,
  bookIdParamRules,
  listBooksQueryRules,
} = require('../validators/bookValidators');

router.get('/', listBooksQueryRules, validateRequest, getBooks);
router.get('/:id', bookIdParamRules, validateRequest, getBookById);

router.post('/', protect, authorize('admin'), createBookRules, validateRequest, createBook);
router.put('/:id', protect, authorize('admin'), updateBookRules, validateRequest, updateBook);
router.delete('/:id', protect, authorize('admin'), bookIdParamRules, validateRequest, deleteBook);

module.exports = router;
