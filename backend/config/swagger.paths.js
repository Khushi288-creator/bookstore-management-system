/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: API is running
 *
 * /api/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       201:
 *         description: User registered
 *
 * /api/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *
 * /api/auth/me:
 *   get:
 *     summary: Current logged-in user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile
 *
 * /api/books:
 *   get:
 *     summary: List books (search, genre, pagination)
 *     tags: [Books]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated book list
 *   post:
 *     summary: Create book (admin)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, author, genre, isbn, price]
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               genre: { type: string }
 *               isbn: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Book created
 *
 * /api/books/{id}:
 *   get:
 *     summary: Get book by id
 *     tags: [Books]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Book details
 *   put:
 *     summary: Update book (admin)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Book updated
 *   delete:
 *     summary: Delete book (admin)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Book deleted
 *
 * /api/orders:
 *   post:
 *     summary: Place order (customer)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     book: { type: string }
 *                     quantity: { type: integer }
 *     responses:
 *       201:
 *         description: Order created
 *   get:
 *     summary: All orders (admin)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Order list
 *
 * /api/orders/my:
 *   get:
 *     summary: My orders (logged-in user)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: User orders
 *
 * /api/orders/{id}:
 *   get:
 *     summary: Order by id (owner or admin)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order details
 *
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel order and restore stock
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order cancelled
 *
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (admin)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string }
 *               paymentStatus: { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 */

module.exports = {};
