# Bookstore Frontend (React + Vite)

## Run locally
```bash
cd frontend
npm install
cp .env.example .env      # set VITE_API_URL (default http://localhost:5000)
npm run dev               # http://localhost:5173
```
Backend must be running on the URL in `VITE_API_URL`.

## Pages
- `/` Home, `/books` list (search, genre filter, pagination), `/books/:id` detail
- `/login`, `/register`
- `/cart`, `/checkout` (login required), `/orders` (my orders, cancel)
- `/admin` manage books (add/edit/delete), `/admin/orders` manage order status (admin only)

## Deploy (Vercel)
Root directory `frontend`, build `npm run build`, output `dist`, env `VITE_API_URL=<your Render backend URL>`.
`vercel.json` handles SPA routing.
