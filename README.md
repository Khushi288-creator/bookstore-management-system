# Bookstore Management System (MERN Stack)

Full-stack bookstore web app with JWT authentication, role-based access, book inventory, and order processing.

## Tech Stack

| Layer | Tools |
|-------|--------|
| Backend | Node.js, Express, MongoDB Atlas, Mongoose, JWT, express-validator |
| Frontend | React (Vite) — planned |
| Testing | Jest + Supertest (backend) |
| API docs | Swagger UI + Postman/Thunder collection in `docs/` |

## Project Structure

```
bookstore-management-system/
├── backend/          # REST API
│   ├── app.js        # Express app (used by tests + server)
│   ├── server.js     # Starts HTTP server
│   ├── tests/        # Jest + Supertest
│   └── scripts/      # createAdmin.js
├── docs/             # API collection export
└── frontend/         # React app (coming soon)
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # fill MONGO_URI, JWT_SECRET, PORT (never commit .env)
npm run dev            # http://localhost:5000
```

### Create admin user (do not use public register for admin)

```bash
npm run create-admin -- admin@example.com YourStrongPassword Admin
# or set ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env and run:
npm run create-admin
```

## API Documentation

- **Swagger UI:** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **OpenAPI JSON:** [http://localhost:5000/api/docs.json](http://localhost:5000/api/docs.json)
- **Postman / Thunder Client:** import `docs/bookstore-api.postman_collection.json`

## API Endpoints

### Auth

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/register` | Public (always creates **customer**) |
| POST | `/api/login` | Public |
| GET | `/api/auth/me` | Bearer token |

### Books

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/books` | Public (search, genre, pagination) |
| GET | `/api/books/:id` | Public |
| POST | `/api/books` | Admin |
| PUT | `/api/books/:id` | Admin |
| DELETE | `/api/books/:id` | Admin |

### Orders

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | Logged-in user |
| GET | `/api/orders/my` | Logged-in user (own orders) |
| GET | `/api/orders` | Admin (all orders) |
| GET | `/api/orders/:id` | Owner or admin |
| PUT | `/api/orders/:id/cancel` | Owner or admin (restores stock) |
| PUT | `/api/orders/:id/status` | Admin |

## Backend Tests

Tests use a **separate database** (`bookstore_test` on the same cluster by default). Your main `bookstore` data is not wiped; only the test DB collections are cleared after each test.

Optional in `backend/.env`:

```env
MONGO_URI_TEST=mongodb+srv://.../bookstore_test?retryWrites=true&w=majority
```

Run:

```bash
cd backend
npm test
```

## Progress

- [x] Backend API (auth, books, orders, validation, admin script)
- [x] Swagger + API collection + backend tests
- [ ] Frontend (React)
- [ ] Deployment (Render + Vercel)

## Live Links (after deployment)

- Backend: _TBD_
- Frontend: _TBD_
