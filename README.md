# TypeScript CRUD API

A RESTful API built with **Node.js**, **TypeScript**, **Express 5**, and **MySQL** (via Sequelize ORM). Features a full account management system with JWT authentication, refresh tokens, email verification, and role-based access control.

---

## Features

- **Authentication** — JWT access tokens (15-min expiry) + HTTP-only refresh token cookies (7-day expiry)
- **Account Registration** — Email verification required before login
- **Password Management** — Forgot password / reset password via email
- **Role-Based Access Control** — `Admin` and `User` roles
- **CRUD for Users** — Full create, read, update, delete endpoints
- **Swagger UI** — Interactive API docs at `/api-docs`
- **Input Validation** — Request validation using Joi schemas
- **ORM** — Sequelize with auto-sync (`alter: true`) on startup
- **SSL/TLS** — Enforced TLS 1.2+ on database connections

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Runtime      | Node.js (≥ 18)                      |
| Language     | TypeScript 6                        |
| Framework    | Express 5                           |
| Database     | MySQL (TiDB Cloud / local MySQL)    |
| ORM          | Sequelize 6                         |
| Auth         | `jsonwebtoken`, `express-jwt`       |
| Hashing      | `bcryptjs`                          |
| Validation   | Joi                                 |
| Email        | Nodemailer (Ethereal for dev)       |
| API Docs     | Swagger UI Express + YAML           |
| Dev Tools    | `ts-node`, `nodemon`, TypeScript    |

---

## Project Structure

```
├── src/
│   ├── _helpers/
│   │   ├── db.ts               # Sequelize initialization & model loading
│   │   ├── role.ts             # Role enum (Admin, User)
│   │   ├── send-email.ts       # Nodemailer helper
│   │   └── swagger.ts          # Swagger UI router
│   ├── accounts/
│   │   ├── account.controller.ts   # Account route handlers
│   │   ├── account.model.ts        # Sequelize account model
│   │   ├── accounts.service.ts     # Business logic
│   │   └── refresh-token.model.ts  # Refresh token model
│   ├── middleware/
│   │   ├── authorize.ts        # JWT guard + role check
│   │   ├── errorHandler.ts     # Global error handler
│   │   └── validateRequest.ts  # Joi validation middleware
│   ├── users/
│   │   ├── user.model.ts       # Sequelize user model
│   │   ├── user.service.ts     # User CRUD service
│   │   └── users.controller.ts # User route handlers
│   └── server.ts               # App entry point
├── config.json                 # Production DB & SMTP config
├── config.dev.json             # Local development config
├── swagger.yaml                # OpenAPI 3.0 specification
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js **≥ 18**
- MySQL database (local or [TiDB Cloud](https://tidbcloud.com))
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Zagreeed/node-mysql-api
cd node-mysql-api

# Install dependencies
npm install
```

### Configuration

The app can reads from **`config.json`** (development) or **`config.prod.json`** (production). Update the relevant file with your credentials:

```json
{
  "database": {
    "host": "your-db-host",
    "port": 3306,
    "user": "your-db-user",
    "password": "your-db-password",
    "database": "node_mysql_api"
  },
  "secret": "your-jwt-secret",
  "emailform": "no-reply@your-domain.com",
  "smtOptions": {
    "host": "smtp.ethereal.email",
    "port": 587,
    "auth": {
      "user": "your-smtp-user",
      "pass": "your-smtp-password"
    }
  }
}
```

> **Note:** For local development with a non-SSL MySQL instance, you may need to disable or adjust the SSL options in `src/_helpers/db.ts`.

> ⚠️ **Security:** Never commit `config.json` or `config.dev.json` to version control. Add them to `.gitignore`.

### Run in Development

```bash
npm run start:dev
```

Starts the server with `nodemon` + `ts-node` and hot-reloads on file changes.

### Build & Run in Production

```bash
# Compile TypeScript to JavaScript
npm run build

# Start the compiled server
npm start
```

The server starts on **`http://localhost:4000`** by default. Override the port with the `PORT` environment variable.

---

## API Reference

Interactive Swagger docs are available at:

```
http://localhost:4000/api-docs
```

### Account Endpoints (`/accounts`)

| Method | Endpoint                        | Auth Required | Description                              |
|--------|---------------------------------|---------------|------------------------------------------|
| POST   | `/accounts/authenticate`        | No            | Login, returns JWT + sets refresh cookie |
| POST   | `/accounts/refresh-token`       | Cookie        | Issue a new JWT using refresh token      |
| POST   | `/accounts/revoke-token`        | Bearer        | Revoke a refresh token                   |
| POST   | `/accounts/register`            | No            | Register and send verification email     |
| POST   | `/accounts/verify-email`        | No            | Verify email with token                  |
| POST   | `/accounts/forgot-password`     | No            | Send password reset email                |
| POST   | `/accounts/validate-reset-token`| No            | Validate a password reset token          |
| POST   | `/accounts/reset-password`      | No            | Reset password using token               |
| GET    | `/accounts`                     | Admin         | Get all accounts                         |
| GET    | `/accounts/:id`                 | Bearer        | Get account by ID                        |
| POST   | `/accounts`                     | Admin         | Create account (no email verification)   |
| PUT    | `/accounts/:id`                 | Bearer        | Update account                           |
| DELETE | `/accounts/:id`                 | Bearer        | Delete account                           |

### User Endpoints (`/users`)

| Method | Endpoint      | Description       |
|--------|---------------|-------------------|
| GET    | `/users`      | Get all users     |
| GET    | `/users/:id`  | Get user by ID    |
| POST   | `/users`      | Create a user     |
| PUT    | `/users/:id`  | Update a user     |
| DELETE | `/users/:id`  | Delete a user     |

---

## Authentication Flow

1. **Register** via `POST /accounts/register` — a verification email is sent.
2. **Verify email** via `POST /accounts/verify-email` with the token from the email.
3. **Login** via `POST /accounts/authenticate` — receive a short-lived `jwtToken` in the response body and a `refreshToken` in an HTTP-only cookie.
4. **Authorize requests** by including the JWT as a `Bearer` token in the `Authorization` header.
5. **Refresh** the JWT via `POST /accounts/refresh-token` using the cookie before it expires.

---

## Role-Based Access

- The **first account** registered is automatically assigned the `Admin` role.
- All subsequent accounts are assigned the `User` role by default.
- Admin users can manage all accounts; regular users can only manage their own.

---

## Scripts

| Script              | Description                              |
|---------------------|------------------------------------------|
| `npm run start:dev` | Run in dev mode with hot reload          |
| `npm run build`     | Compile TypeScript to `dist/`            |
| `npm start`         | Run compiled output from `dist/`         |
| `npm test`          | Run tests via `ts-node`                  |

---

## CORS

The server is configured to allow requests from `http://localhost:4200` (Angular dev server) with credentials. Update the `corsOptions` in `src/server.ts` to match your frontend URL.

---

## License

ISC