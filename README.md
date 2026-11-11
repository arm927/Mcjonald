# McJoe a cafe — Frontend (MERN: the "R" in MERN)

React + Vite frontend for the McJoe cafe web application.
Backend (Express + Node) and database (MongoDB) are **not included yet**.

## Run it
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Features
- **Home** – hero, live stats, customer favorites
- **Menu** – browse, filter by category, search
- **Manage Menu** – full CRUD for menu items (add, view, edit, delete) with validation
- **Orders** – full CRUD for customer orders, line items, totals, status tracking

## Structure
```
src/
  components/   Navbar, Footer, Modal, ConfirmDialog, MenuCard, Toast
  pages/        Home, Menu, ManageMenu, Orders, NotFound
  services/api.js   data layer (currently localStorage)
  data/seed.js      starter menu + orders
```

## Connecting the backend later
All data access goes through `src/services/api.js`. It uses `localStorage` for now
so CRUD works without a server. When Express/MongoDB is ready, replace each function
body with a `fetch` call to your REST endpoints (`GET/POST/PUT/DELETE /api/menu`,
`/api/orders`). No page or component needs to change.
