# ShopHub API - AWS Serverless Setup

This repository contains a Serverless Framework configuration with AWS Lambda functions fronted by API Gateway (HTTP API) endpoints. It includes authentication, product management, and checkout with idempotency key support.

## Prerequisites

- Node.js 20.x (LTS)
- npm or yarn
- AWS CLI configured with credentials having deployment permissions

## Getting Started

1. **Install dependencies** (run from repo root)

   ```bash
   npm run install:all
   ```

2. **Local development** using `serverless-offline` (run from repo root):

   ```bash
   npm run start:api
   ```

   This will spin up a local HTTP API at http://localhost:3000.

   _If you bump or pin dependencies (e.g. downgrading `serverless-offline`), run `npm run install:all` again before invoking offline._

## API Endpoints

All endpoints (except `/auth/login`) require the header:

```
Authorization: Bearer dummy-jwt-token
```

---

### 1. Authentication

#### `POST /auth/login`

Login with email and password to receive a JWT token.

**Request:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test@123"}'
```

**Success Response (200):**

```json
{
  "accessToken": "dummy-jwt-token",
  "user": {
    "id": "u_123",
    "email": "test@example.com"
  }
}
```

**Error Response - Invalid Credentials (401):**

```json
{
  "error": {
    "code": 401,
    "message": "Invalid Credentials",
    "details": {}
  }
}
```

---

### 2. Products

#### `GET /products`

Retrieve a paginated list of products with optional filtering by page and pageSize.

**Request:**

```bash
curl -X GET "http://localhost:3000/products?page=1&pageSize=10" \
  -H "Authorization: Bearer dummy-jwt-token"
```

**Success Response (200):**

```json
{
  "items": [
    {
      "id": "p1",
      "name": "Mechanical Keyboard",
      "description": "RGB Mechanical keyboard with Cherry MX switches",
      "price": 89.99,
      "currency": "USD",
      "stock": 12,
      "category": "Accessories",
      "imageUrl": "https://example.com/p1.jpg"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 38
}
```

**Error Response - Missing Authorization (401):**

```json
{
  "error": {
    "code": 401,
    "message": "Unauthorized - Invalid or missing token",
    "details": {}
  }
}
```

---

#### `GET /products/{id}`

Retrieve details for a single product by ID.

**Request:**

```bash
curl -X GET "http://localhost:3000/products/p1" \
  -H "Authorization: Bearer dummy-jwt-token"
```

**Success Response (200):**

```json
{
  "id": "p1",
  "name": "Mechanical Keyboard",
  "description": "RGB Mechanical keyboard with Cherry MX switches",
  "price": 89.99,
  "currency": "USD",
  "stock": 12,
  "category": "Accessories",
  "imageUrl": "https://example.com/p1.jpg"
}
```

**Error Response - Product Not Found (404):**

```json
{
  "error": {
    "code": 404,
    "message": "Product not found",
    "details": {
      "id": "id"
    }
  }
}
```

**Error Response - Missing Authorization (401):**

```json
{
  "error": {
    "code": 401,
    "message": "Unauthorized - Invalid or missing token",
    "details": {}
  }
}
```

---

### 3. Idempotency Keys

#### `GET /keys`

Generate a random idempotency key for use in checkout requests. Use this key to ensure transaction uniqueness.

**Request:**

```bash
curl -X GET "http://localhost:3000/keys" \
  -H "Authorization: Bearer dummy-jwt-token"
```

**Success Response (200):**

```json
{
  "key": "idempotency-1709554800000-abc123def",
  "timestamp": "2026-03-04T10:30:00.000Z"
}
```

**Error Response - Missing Authorization (401):**

```json
{
  "error": {
    "code": 401,
    "message": "Unauthorized - Invalid or missing token",
    "details": {}
  }
}
```

---

### 4. Checkout

#### `POST /checkout`

Process a checkout request with items and an idempotency key. The first request with a valid key succeeds; subsequent requests with the same key are rejected to prevent duplicate transactions.

**Request:**

```bash
curl -X POST "http://localhost:3000/checkout" \
  -H "Authorization: Bearer dummy-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "idempotency-1709554800000-abc123def",
    "items": [
      {
        "id": "p1",
        "name": "Mechanical Keyboard",
        "price": 89.99
      }
    ]
  }'
```

**Success Response (200):**

```json
{
  "message": "Checkout successful",
  "key": "idempotency-1709554800000-abc123def",
  "subtotal": "89.99",
  "total": "89.99",
  "itemCount": 1
}
```

**Error Response - Missing Idempotency Key (400):**

```json
{
  "error": {
    "code": 400,
    "message": "Idempotency key is required",
    "details": {}
  }
}
```

**Error Response - Duplicate Transaction (409):**

```json
{
  "error": {
    "code": 409,
    "message": "Transaction with this idempotency key already exists",
    "details": {}
  }
}
```

**Error Response - No Items in Request (400):**

```json
{
  "error": {
    "code": 400,
    "message": "At least one item is required for checkout",
    "details": {}
  }
}
```

**Error Response - Invalid JSON (400):**

```json
{
  "error": {
    "code": 400,
    "message": "Invalid JSON in request body",
    "details": {}
  }
}
```

**Error Response - Missing Authorization (401):**

```json
{
  "error": {
    "code": 401,
    "message": "Unauthorized - Invalid or missing token",
    "details": {}
  }
}
```

---

## Project Structure

```
src/
├── data/
│   ├── products.js      # Product data
├── handlers/
│   ├── auth.js          # Login handler
│   ├── products.js      # Product listing and detail handlers
│   └── keys.js          # Key generation and checkout handlers
└── utils/
    └── auth.js          # Authentication middleware
```

---

## Testing Credentials

Use the following credentials for authentication:

- **Email:** `test@example.com`
- **Password:** `test@123`
- **Token:** `dummy-jwt-token` (automatically returned)

---

## Cleanup

To remove the deployed stack:

```bash
npm run remove
```
