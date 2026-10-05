# 📚 Bookstore Management System (MERN Stack)

Full-stack bookstore web app with JWT authentication, role-based access, book inventory management, and order processing.

## Tech Stack
- **Frontend:** React, React Router, Redux/Context API, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt

## Project Structure
```
bookstore-management-system/
├── backend/     # Node + Express + MongoDB REST API
└── frontend/    # React app
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in your MongoDB URI and JWT secret
npm run dev             # starts on http://localhost:5000
```

## API Endpoints (implemented so far)

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/register | Public |
| POST | /api/login | Public |

### Books
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/books | Public |
| GET | /api/books/:id | Public |
| POST | /api/books | Admin |
| PUT | /api/books/:id | Admin |
| DELETE | /api/books/:id | Admin |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/orders | Logged-in user |
| GET | /api/orders | Admin |
| GET | /api/orders/:id | Owner or Admin |
| PUT | /api/orders/:id/status | Admin |

## Status
- [x] Backend project structure
- [x] User/Book/Order models
- [x] JWT auth (register/login)
- [x] Role-based middleware
- [x] Book CRUD + search/pagination
- [x] Order processing
- [ ] Frontend (React)
- [ ] Deployment
