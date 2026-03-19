# Candidate Tasks

## Tasks

Implement the following features using the provided APIs [API Readme](../api/README.md).

### 1. Product Listing

- Fetch products from API
- Display products in a responsive grid
- Show product details:
  - image
  - name/title
  - category
  - description
  - price
  - stock status
- Implement loading state
- Implement pagination (10 records per page)
- Handle API errors gracefully

> **Note:** Tasks 2–4 (Cart System, Cart Counter, Price Calculations) must be implemented entirely on the `client side`. Do not make API calls for these operations - manage all cart state locally using `localStorage` or an in-memory state service.

### 2. Cart System

- Add items to cart
- Remove items from cart
- Update item quantity
- Display cart items in cart page
- Persist cart state (localStorage or state management)

### 3. Cart Counter

- Show total items in cart in the header
- Update counter dynamically

### 4. Price Calculations

- Display price per item
- Calculate subtotal
- Calculate total cart price
- Handle quantity updates correctly

### 5. Checkout Flow

Create a checkout page with:

- Customer information form
  - name
  - email
  - address
- Order summary
- Submit order to API

### 6. Idempotent Order Placement

- Get an `Idempotency Key` from API
- Send it with the checkout request
- Handle duplicate requests properly
- Prevent double order submission

### 7. Error Handling

Handle errors for:

- API failures
- Invalid form data
- Network errors

Display meaningful messages to the user.

### 8. UI Improvements

Improve the existing UI where needed.

Focus on:

- Usability
- Layout
- Responsiveness

### 9. Unit Testing

Write unit tests for:

- At least one component
- At least one service

### 10. Code Quality

Ensure:

- Clean code
- Reusable components
- Proper naming conventions
- Proper folder structure
- Proper error handling for all negative cases
