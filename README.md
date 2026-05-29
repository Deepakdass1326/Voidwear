<div align="center">

# 🖤 VOIDWEAR

### Full-Stack E-Commerce Platform for Fashion Retail

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

*A modern, full-stack fashion e-commerce platform with role-based access, real-time cart management via MongoDB aggregation pipelines, image CDN, and Google OAuth.*

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [MongoDB Aggregation Pipeline](#mongodb-aggregation-pipeline)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Razorpay Payment Integration](#razorpay-payment-integration)
- [Deployment](#deployment)

---

## Overview

Voidwear is a **production-ready e-commerce web application** built for fashion retail. It supports two distinct user roles — **Buyers** and **Sellers** — each with their own dashboard, flows, and protected routes.

Key highlights:
- 🛒 **MongoDB Aggregation-powered Cart** — prices, variant details, and totals are computed directly in the DB, never on the client.
- 🖼️ **ImageKit CDN** — all product images are uploaded and served via ImageKit with URL transformations.
- 🔐 **Google OAuth 2.0** — one-click sign-in alongside traditional email/password auth.
- 🎭 **Variant System** — every product supports multiple variants (colour, size, fit) with individual pricing and stock.
- ⚛️ **Redux Toolkit** — full global state management for auth, products, and cart.

---

## Tech Stack

### Backend
| Tech | Purpose |
|------|---------|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose 9** | Database & ODM |
| **JWT** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Passport.js + Google OAuth 2.0** | Social login |
| **ImageKit** | Image CDN & storage |
| **Multer** | Multipart file upload handling |
| **express-validator** | Request validation |
| **cookie-parser** | Cookie-based JWT transport |
| **Morgan** | HTTP request logging |
| **dotenv** | Environment variable management |

### Frontend
| Tech | Purpose |
|------|---------|
| **React 19** | UI library |
| **Vite 8** | Build tool & dev server |
| **React Router 7** | Client-side routing |
| **Redux Toolkit 2** | Global state management |
| **Axios** | HTTP client |
| **Tailwind CSS 4** | Utility-first styling |

---

## Project Structure

```
Voidwear/
├── Backend/
│   ├── server.js                    # Entry point
│   ├── .env                         # Environment variables
│   └── src/
│       ├── app.js                   # Express app setup
│       ├── config/                  # DB & Passport config
│       ├── controllers/
│       │   ├── auth.controller.js   # Register, Login, Google OAuth
│       │   ├── product.controller.js
│       │   └── cart.controller.js   # Aggregation pipeline cart
│       ├── dao/
│       │   └── product.dao.js       # Stock lookup
│       ├── middleware/
│       │   └── auth.middleware.js   # JWT + role guard
│       ├── models/
│       │   ├── user.models.js
│       │   ├── product.models.js
│       │   ├── cart.model.js
│       │   └── price.schema.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── product.routes.js
│       │   └── cart.routes.js
│       ├── services/
│       │   └── storage.service.js   # ImageKit upload helper
│       └── validation/
│           ├── auth.validator.js
│           ├── product.validator.js
│           └── cart.validator.js
│
└── Frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── app/
        │   ├── App.jsx
        │   ├── app.routes.jsx        # All route definitions
        │   └── app.store.js          # Redux store
        └── features/
            ├── auth/
            │   ├── pages/            # Login, Register
            │   ├── components/       # Protected route wrapper
            │   ├── hook/
            │   ├── service/
            │   └── state/            # auth.slice.js
            ├── products/
            │   ├── pages/            # Home, ProductDetails, CreateProduct, SellerDashboard
            │   ├── hooks/
            │   ├── services/
            │   └── state/            # product.slice.js
            └── cart/
                ├── page/             # cart.jsx
                ├── hook/             # usecart.js
                ├── service/          # cart.api.js
                └── state/            # cart.slice.js
```

---

## Features

### 🧑‍💼 Authentication
- **Email/Password Registration & Login** with bcrypt password hashing
- **Google OAuth 2.0** one-click sign-in via Passport.js
- **JWT** stored in HTTP-only cookies
- **Role-based access control** — `buyer` vs `seller`
- Protected routes on both frontend (`<Protected role="..." />`) and backend middleware

### 🏠 Product Catalog (Buyer)
- Browse all products on the Home page
- View detailed product page with all variant options
- Filter and select variants (colour, size, fit)
- Add to cart directly from product detail

### 🛒 Cart & Checkout System
- **MongoDB Aggregation Pipeline** — 8-stage pipeline computes:
  - Joins product details via `$lookup`
  - Matches selected variant via `$unwind` + `$match` (automatically handles base products via default variants)
  - Calculates per-item price via `$addFields`
  - Sums total cart value via `$group`
- **Optimistic UI updates** — quantity changes reflect instantly
- Add, update quantity, and remove items
- **Razorpay Integration** — full checkout flow with HMAC signature verification
- **Order History** — view past successful orders with item breakdown and status
- Currency symbol auto-mapped (₹, $, €, £)

### 🏪 Seller Dashboard
- Create new products with up to 7 images (uploaded to ImageKit CDN)
- Base products automatically get a hidden "default variant" to ensure seamless cart aggregation
- Add product variants with individual pricing, stock, attributes (Size/Colour), and images
- View all seller-owned products
- Product detail and stock management without page reloads

### 🖼️ Image Management (ImageKit CDN)
- Images uploaded server-side via Multer → ImageKit
- Optimized delivery via CDN URLs
- Fallback to Unsplash dummy image on broken URLs

---

## API Reference

### Auth Endpoints — `/api/auth`

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| `POST` | `/register` | Register new user | Public |
| `POST` | `/login` | Login with email & password | Public |
| `GET` | `/google` | Initiate Google OAuth flow | Public |
| `GET` | `/google/callback` | Google OAuth callback | Public |
| `GET` | `/me` | Get current authenticated user | Private |

### Product Endpoints — `/api/products`

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| `GET` | `/` | Get all products | Public |
| `GET` | `/detail/:id` | Get single product details | Public |
| `GET` | `/seller` | Get products owned by logged-in seller | Seller |
| `POST` | `/` | Create a new product (with images) | Seller |
| `POST` | `/:productId/variants` | Add variant to a product | Seller |

### Cart Endpoints — `/api/cart`

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| `GET` | `/` | Get cart (via aggregation pipeline) | Buyer |
| `POST` | `/add/:productId/:variantId` | Add item to cart | Buyer |
| `PATCH` | `/update/:productId/:variantId` | Update item quantity | Buyer |
| `DELETE` | `/remove/:productId/:variantId` | Remove item from cart | Buyer |
| `POST` | `/payment/create/order` | Create Razorpay order | Buyer |
| `POST` | `/payment/verify/order` | Verify Razorpay payment signature | Buyer |
| `GET` | `/payment/orders` | Get user order history | Buyer |

---

## Database Schema

### User
```js
{
  name: String,
  email: String,         // unique
  password: String,      // bcrypt hashed
  role: 'buyer' | 'seller',
  googleId: String       // for OAuth users
}
```

### Product
```js
{
  title: String,
  description: String,
  seller: ObjectId,      // ref: User
  price: {
    amount: Number,
    currency: String     // 'INR', 'USD', etc.
  },
  image: [{ url: String }],
  variants: [{
    images: [{ url: String }],
    stock: Number,
    attributes: {
      Colour: String,
      Size: String,
      Fit: String        // optional
    },
    price: {
      amount: Number,
      currency: String
    }
  }]
}
```

### Cart
```js
{
  user: ObjectId,        // ref: User
  items: [{
    product: ObjectId,   // ref: Product
    variant: ObjectId,   // ref: Product.variants._id
    quantity: Number
  }],
  price: PriceSchema
}
```

---

## MongoDB Aggregation Pipeline

The cart uses an **8-stage aggregation pipeline** that resolves product data, matches variants, and computes prices entirely in the database:

```js
cartModel.aggregate([
  // Stage 1 — Filter by user
  { $match: { user: ObjectId(userId) } },

  // Stage 2 — Flatten items array
  { $unwind: { path: '$items' } },

  // Stage 3 — Join with products collection
  {
    $lookup: {
      from: 'products',
      localField: 'items.product',
      foreignField: '_id',
      as: 'items.products'
    }
  },

  // Stage 4 — Unwind looked-up product array → single object
  { $unwind: { path: '$items.products' } },

  // Stage 5 — Unwind variants array → one doc per variant
  { $unwind: { path: '$items.products.variants' } },

  // Stage 6 — Keep only the selected variant
  {
    $match: {
      $expr: { $eq: ['$items.variant', '$items.products.variants._id'] }
    }
  },

  // Stage 7 — Compute per-item price
  {
    $addFields: {
      'items.itemPrice': {
        $multiply: ['$items.quantity', '$items.products.variants.price.amount']
      }
    }
  },

  // Stage 8 — Group items back into one cart document
  {
    $group: {
      _id: '$_id',
      totalPrice: { $sum: '$items.itemPrice' },
      currency: { $first: '$items.products.variants.price.currency' },
      items: { $push: '$items' }
    }
  }
])
```

**Resulting response shape:**
```json
{
  "_id": "...",
  "totalPrice": 1550,
  "currency": "INR",
  "items": [
    {
      "variant": "ObjectId",
      "quantity": 1,
      "itemPrice": 1200,
      "products": {
        "_id": "...",
        "title": "THE BEAR HOUSE",
        "image": [{ "url": "..." }],
        "variants": {
          "_id": "...",
          "images": [{ "url": "..." }],
          "attributes": { "Colour": "Green Check", "Size": "S,M,L" },
          "price": { "amount": 1200, "currency": "INR" },
          "stock": 194
        }
      }
    }
  ]
}
```

---

## Environment Variables

Create a `.env` file in `/Backend`:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImageKit CDN
IMAGEKIT_KEY=private_xxxxxxxxxxxx
IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Razorpay (for payment integration)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## Getting Started

### Prerequisites
- Node.js `>= 18`
- MongoDB Atlas account (or local MongoDB)
- ImageKit account
- Google Cloud Console project (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/Deepakdass1326/Voidwear.git
cd Voidwear
```

### 2. Setup Backend
```bash
cd Backend
npm install
# Create and fill .env (see Environment Variables section)
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd Frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### 4. Vite Proxy (already configured)
The frontend proxies `/api` requests to the backend, so no CORS issues in development.

---

## Razorpay Payment Integration

The platform includes a fully working Razorpay checkout integration with secure backend verification.

### Flow Overview

1. **User clicks "Proceed to Checkout"**
2. **Frontend** calls `POST /api/cart/payment/create/order`
3. **Backend** initializes an order via `razorpay.orders.create()` and returns the `orderId` and amount.
4. **Frontend** opens the Razorpay checkout modal pre-filled with user details.
5. **User completes payment**
6. **Frontend** receives the success response and calls `POST /api/cart/payment/verify/order` with the signature.
7. **Backend** performs an HMAC SHA256 signature verification using the `RAZORPAY_KEY_SECRET`.
8. On success, a `Payment` record is created, cart items are cleared, and the user is redirected to the `/order-success` page.

### Test Card Details (Razorpay Test Mode)

| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | `123456` |

> Use `rzp_test_*` keys in `.env` during development. Switch to `rzp_live_*` for production.

---

## Deployment

### Backend (Railway / Render / EC2)
```bash
# Set all environment variables in your hosting platform
# Start command:
node server.js
```

### Frontend (Vercel / Netlify)
```bash
npm run build
# Deploy the /dist folder
# Set VITE_API_URL if not using proxy
```

### Update CORS in production
```js
// app.js
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

---

## License

ISC © Voidwear

---

<div align ="center">
Built 🖤 by the Voidwear team
</div>
