# 🛒 Online Shop — NestJS Application

> Full-featured e-commerce backend built with **NestJS**, **TypeORM**, and **PostgreSQL**.

---

## 📦 Features

- 🛍️ **Products** — CRUD, search, filters, pagination, image upload
- 🛒 **Cart** — Add / remove / update items, persist per user
- 👤 **User Area** — Register, login, profile, order history
- 🔐 **Auth** — JWT-based authentication, role guards
- ⭐ **Comments & Reviews** — Per product, moderation flow
- 📦 **Orders** — Checkout, status tracking, invoice generation
- 🏷️ **Categories** — Tree / flat structure, product assignment
- ⚙️ **Admin Panel** — Full control over all entities + site settings
- 🔍 **Search** — Full-text search on products

---

## 🧱 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | NestJS                              |
| Language    | TypeScript                          |
| ORM         | TypeORM                             |
| Database    | PostgreSQL                          |
| Auth        | Passport.js + JWT                   |
| Validation  | class-validator + class-transformer |
| File Upload | Multer                              |
| API Docs    | Swagger / OpenAPI                   |

---

## 🚀 Getting Started

```bash
# clone
git clone https://github.com/your-org/online-shop.git
cd online-shop

# install
npm install

# environment
cp .env.example .env

# run
npm run start:dev
```

### Environment Variables

```env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/shop
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
```

---

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/               # JWT auth, guards, strategies
│   ├── users/              # User CRUD, roles
│   ├── products/           # Product CRUD, search, images
│   ├── categories/         # Category tree management
│   ├── cart/               # Cart logic (per user)
│   ├── orders/             # Order creation, status, history
│   ├── comments/           # Reviews & comments, moderation
│   ├── admin/              # Admin dashboard & site settings
│   └── upload/             # File upload handling
├── common/
│   ├── decorators/         # e.g. @CurrentUser, @Roles
│   ├── guards/             # e.g. RolesGuard, JwtAuthGuard
│   ├── filters/            # Exception filters
│   ├── interceptors/       # Transformation / logging
│   └── dto/                # Shared DTOs
├── config/                 # Database, Swagger, env config
└── main.ts                 # Entry point
```

---

## 🔐 Roles & Permissions

| Role      | Permissions                                      |
|-----------|--------------------------------------------------|
| `USER`    | Browse, cart, order, own profile, write comments |
| `ADMIN`   | Full CRUD on all entities + site settings        |
| `SUPER`   | Manage admins, system config                     |

---

## 🧩 API Overview

### 🔑 Auth

| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| POST   | `/auth/register`  | Register new user  |
| POST   | `/auth/login`     | Login, get JWT     |
| GET    | `/auth/profile`   | Get current user   |

### 👤 Users

| Method | Endpoint              | Auth  | Description       |
|--------|-----------------------|-------|-------------------|
| GET    | `/users`              | Admin | List all users    |
| GET    | `/users/:id`          | Admin | Get user by ID    |
| PATCH  | `/users/:id`          | Admin | Update user       |
| DELETE | `/users/:id`          | Admin | Delete user       |

### 🛍️ Products

| Method | Endpoint                 | Auth  | Description               |
|--------|--------------------------|-------|---------------------------|
| GET    | `/products`              | -     | List (search, filter, page) |
| GET    | `/products/:slug`        | -     | Get by slug               |
| POST   | `/products`              | Admin | Create product            |
| PATCH  | `/products/:id`          | Admin | Update product            |
| DELETE | `/products/:id`          | Admin | Delete product            |
| POST   | `/products/:id/images`   | Admin | Upload images             |

### 🏷️ Categories

| Method | Endpoint               | Auth  | Description          |
|--------|------------------------|-------|----------------------|
| GET    | `/categories`          | -     | List all categories  |
| GET    | `/categories/:id`      | -     | Get with children    |
| POST   | `/categories`          | Admin | Create category      |
| PATCH  | `/categories/:id`      | Admin | Update category      |
| DELETE | `/categories/:id`      | Admin | Delete category      |

### 🛒 Cart

| Method | Endpoint                    | Auth | Description              |
|--------|-----------------------------|------|--------------------------|
| GET    | `/cart`                     | User | Get current cart         |
| POST   | `/cart/items`               | User | Add item to cart         |
| PATCH  | `/cart/items/:itemId`       | User | Update item quantity     |
| DELETE | `/cart/items/:itemId`       | User | Remove item from cart    |
| DELETE | `/cart`                     | User | Clear entire cart        |

### 📦 Orders

| Method | Endpoint              | Auth     | Description          |
|--------|-----------------------|----------|----------------------|
| POST   | `/orders`             | User     | Place order (from cart) |
| GET    | `/orders`             | User     | My order history     |
| GET    | `/orders/:id`         | User     | Order details        |
| GET    | `/orders/admin`       | Admin    | All orders           |
| PATCH  | `/orders/:id/status`  | Admin    | Update order status  |

### ⭐ Comments & Reviews

| Method | Endpoint                         | Auth     | Description              |
|--------|----------------------------------|----------|--------------------------|
| GET    | `/products/:productId/comments`  | -        | List comments for product |
| POST   | `/products/:productId/comments`  | User     | Add comment / review     |
| DELETE | `/comments/:id`                  | User     | Delete own comment       |
| GET    | `/admin/comments`                | Admin    | All comments (pending)   |
| PATCH  | `/admin/comments/:id/approve`    | Admin    | Approve / reject comment |

### ⚙️ Admin — Site Settings

| Method | Endpoint                 | Auth  | Description              |
|--------|--------------------------|-------|--------------------------|
| GET    | `/admin/settings`        | Admin | Get all settings         |
| PATCH  | `/admin/settings`        | Admin | Update site settings     |
| GET    | `/admin/dashboard`       | Admin | Stats: orders, users, revenue |

### 📄 Swagger

```
GET  /api/docs
```

---

## 🧪 Running Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

---

## 🐳 Docker

```bash
docker-compose up -d
```

`docker-compose.yml` includes the app + PostgreSQL.

---

## 📸 Screenshots

> _Add screenshots of Swagger UI, admin panel, or front-end here._

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/awesome`)
3. Commit changes (`git commit -m 'feat: add awesome'`)
4. Push (`git push origin feat/awesome`)
5. Open a Pull Request

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

---

<p align="center">Made with ❤️ using NestJS</p>