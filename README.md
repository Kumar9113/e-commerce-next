# E-Commerce Next

A full-stack e-commerce storefront and admin panel built with **Next.js 13 (App Router)**, **MongoDB/Mongoose**, and **Stripe Checkout**. Customers can browse products by category, manage a cart, save addresses, and pay via Stripe; admins can add, edit, and remove products and manage incoming orders — all from one Next.js codebase (frontend + API routes together).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 13 (App Router, Route Handlers) |
| UI | React 18, Tailwind CSS, Headless UI |
| State | React Context (`GlobalContext`) + `js-cookie` / `localStorage` |
| Database | MongoDB via Mongoose |
| Auth | JWT (`jsonwebtoken`), password hashing via `bcryptjs` |
| Validation | Joi (request-body schemas on every route) |
| Payments | Stripe Checkout (`stripe`, `@stripe/stripe-js`) |
| Notifications | `react-toastify` |
| Misc | Firebase (image storage URL), `react-spinners` for loaders |

## Project Structure

```
src/
├── app/
│   ├── page.js                     # Home page
│   ├── layout.js                   # Root layout, wraps GlobalState provider
│   ├── database/index.js           # Mongoose connection helper
│   ├── login/, register/           # Auth pages
│   ├── account/                    # Saved addresses management
│   ├── cart/                       # Cart page
│   ├── checkout/                   # Stripe checkout + order placement
│   ├── orders/, orders/[order-details]/   # Customer order history
│   ├── product/listing/{all-products,men,women,kids}/
│   ├── product/[details]/          # Single product page
│   ├── admin-view/, admin-view/all-products/, admin-view/add-product/
│   └── api/                        # Route Handlers (see below)
├── components/                     # Navbar, CartModal, listing/detail cards, form elements, loaders, toasts
├── context/index.js                # Global app state (auth, cart, addresses, orders, loaders)
├── middleware/AuthUser.js          # JWT verification helper used inside API routes
├── models/                         # Mongoose schemas: User, Product, Cart, Address, Order
├── services/                       # Client-side fetch wrappers, one folder per domain
└── utils/index.js                  # Static config: nav links, form-field definitions, etc.
```

## API Routes

All routes live under `src/app/api/**/route.js` (Next.js Route Handlers).

**Auth**
- `POST /api/register` — create account (bcrypt-hashed password)
- `POST /api/login` — verify credentials, issue a 1-day JWT

**Products (public + admin)**
- `GET /api/admin/all-products` — list all products
- `GET /api/admin/product-by-category` — filter by category
- `GET /api/admin/product-by-id` — single product
- `POST /api/admin/add-product` — admin-only, create product
- `POST /api/admin/update-product` — admin-only, edit product
- `POST /api/admin/delete-product` — admin-only, remove product

**Cart**
- `GET /api/cart/all-cart-items`
- `POST /api/cart/add-to-cart`
- `POST /api/cart/delete-from-cart`

**Address**
- `GET /api/address/get-all-address`
- `POST /api/address/add-new-address`
- `POST /api/address/update-address`
- `POST /api/address/delete-address`

**Checkout / Orders**
- `POST /api/stripe` — create a Stripe Checkout Session
- `POST /api/order/create-order` — persist the order, clear the cart
- `GET /api/order/order-details` — single order
- `GET /api/order/get-all-orders` — customer's order history
- `GET /api/admin/orders/get-all-orders` — admin: every order
- `POST /api/admin/orders/update-order` — admin: update order status

Every write route: (1) connects to MongoDB, (2) verifies the JWT via `AuthUser.js`, (3) validates the payload with Joi, (4) performs the Mongoose operation, (5) returns a consistent `{ success, message, data? }` shape.

## Data Models

- **User** — name, email, password (hashed), role (`customer` / `admin`)
- **Product** — name, description, price, category, sizes, deliveryInfo, onSale, priceDrop, imageUrl
- **Cart** — userID → productID, quantity
- **Address** — userID, fullName, address, city, country, postalCode
- **Order** — user, orderItems[] (product + qty), shippingAddress, paymentMethod, totalPrice, isPaid, paidAt, isProcessing

## Core Flow

1. **Auth** — register/login return a JWT, stored in a cookie and attached as `Authorization: Bearer <token>` on subsequent requests.
2. **Browse** — product listing pages fetch from `/api/admin/all-products` (or by category); product detail page loads a single item.
3. **Cart** — "Add to cart" calls `/api/cart/add-to-cart`; cart state is mirrored in React Context + `localStorage` for instant UI feedback.
4. **Checkout** — selected address + cart total are sent to `/api/stripe`, which creates a Stripe Checkout Session and redirects the user to Stripe.
5. **Order creation** — on `?status=success` return from Stripe, the checkout page assembles the order payload from `localStorage` and calls `/api/order/create-order`, which saves the `Order` document and empties the user's `Cart`.
6. **Admin** — `/admin-view/*` pages let an `admin`-role user manage the product catalog and update order status.

## Getting Started

```bash
npm install
```

Create a `.env` file in the project root:

```
DATABASE_URL=<your MongoDB connection string>
SECRET_KEY=<JWT signing secret>
PUBLIC_KEY=<Stripe publishable key>
PRIVATE_KEY=<Stripe secret key>
firebase_StroageURL=<Firebase storage base URL, if used for images>
SERVER=<app base URL, e.g. http://localhost:3000>
```

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## ⚠️ Known Issues Worth Fixing Before Production

- **`src/app/database/index.js` has a MongoDB Atlas connection string (including username/password) hard-coded**, ignoring `process.env.DATABASE_URL`. This must move to the environment variable and the exposed credentials should be rotated immediately.
- **`src/app/checkout/page.js` hard-codes a Stripe publishable key** instead of reading `process.env.PUBLIC_KEY`.
- The Stripe route handler (`/api/stripe`) returns `success: true` even in the "not authenticated" branch — should be `false`.
- No server-side check ties an order's `totalPrice`/`isPaid` to the actual Stripe payment confirmation (e.g. no webhook) — the client currently self-reports payment success.
- `package.json` lists both `next` and a stray `next.js` package — the latter should be removed.

## Suggested Next Steps

- Add a Stripe webhook to confirm payment server-side before marking an order paid.
- Move all secrets to environment variables and add `.env` to `.gitignore` (verify it isn't already committed).
- Add pagination/search to product listing and admin order/product tables.
- Add automated tests for the API routes (auth, cart, order creation).