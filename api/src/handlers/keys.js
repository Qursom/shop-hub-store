"use strict";

const { authCheck } = require("../utils/auth");

const KEYS_LIST = [];

// Helper function to generate random idempotency key
const generateIdempotencyKey = () => {
  return `idempotency-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

module.exports.getKey = async (event) => {
  console.log("Get key event:", JSON.stringify(event, null, 2));

  const authError = authCheck(event);
  if (authError) {
    return authError;
  }

  const idempotencyKey = generateIdempotencyKey();

  return {
    statusCode: 200,
    body: JSON.stringify({
      key: idempotencyKey,
      timestamp: new Date().toISOString(),
    }),
  };
};

module.exports.checkout = async (event) => {
  console.log("Checkout event:", JSON.stringify(event, null, 2));

  const authError = authCheck(event);
  if (authError) {
    return authError;
  }

  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          code: 400,
          message: "Invalid JSON in request body",
          details: {},
        },
      }),
    };
  }

  const { key, items } = body;

  // Validate idempotency key
  if (!key || typeof key !== "string" || key.trim() === "") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          code: 400,
          message: "Idempotency key is required and must be a non-empty string",
          details: {},
        },
      }),
    };
  }

  // Check if key already exists in KEYS_LIST
  const existingKey = KEYS_LIST.find((k) => k.key === key);
  if (existingKey) {
    return {
      statusCode: 409,
      body: JSON.stringify({
        error: {
          code: 409,
          message: "Transaction with this idempotency key already exists",
          details: {},
        },
      }),
    };
  }

  // Validate items array
  if (!Array.isArray(items) || items.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          code: 400,
          message: "At least one item is required for checkout",
          details: {},
        },
      }),
    };
  }

  // Validate each item has required fields
  const invalidItem = items.find(
    (item) =>
      !item.id ||
      typeof item.id !== "string" ||
      typeof item.name !== "string" ||
      typeof item.price !== "number" ||
      item.price < 0
  );
  if (invalidItem) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          code: 400,
          message: "Each item must have a valid id (string), name (string), and price (non-negative number)",
          details: { invalidItem },
        },
      }),
    };
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal;

  // Add key to KEYS_LIST
  const keyEntry = {
    key: key,
    timestamp: new Date().toISOString(),
    items: items,
    subtotal: subtotal,
    total: total,
  };
  KEYS_LIST.push(keyEntry);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Checkout successful",
      key: key,
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
      itemCount: items.length,
    }),
  };
};
