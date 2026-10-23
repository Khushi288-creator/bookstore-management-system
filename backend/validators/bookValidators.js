const { body, param, query } = require('express-validator');

const createBookRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('isbn').trim().notEmpty().withMessage('ISBN is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('description').optional().isString(),
  body('imageUrl').optional().isString(),
];

const updateBookRules = [
  param('id').isMongoId().withMessage('Invalid book id'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
  body('genre').optional().trim().notEmpty().withMessage('Genre cannot be empty'),
  body('isbn').optional().trim().notEmpty().withMessage('ISBN cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

const bookIdParamRules = [param('id').isMongoId().withMessage('Invalid book id')];

const listBooksQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  createBookRules,
  updateBookRules,
  bookIdParamRules,
  listBooksQueryRules,
};
