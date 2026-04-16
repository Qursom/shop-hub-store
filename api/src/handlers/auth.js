"use strict";

const DUMMY_USER = {
  id: "u_123",
  email: "test@example.com",
  password: "test@123",
};

module.exports.login = async (event) => {
  console.log("Login request:", JSON.stringify(event, null, 2));
  let body;
  try {
    body = JSON.parse(event.body || "{}");
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

  const { email, password } = body;

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          code: 400,
          message: "Email and password are required",
          details: {},
        },
      }),
    };
  }

  if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: "dummy-jwt-token",
        user: { id: DUMMY_USER.id, email: DUMMY_USER.email },
      }),
    };
  }

  return {
    statusCode: 401,
    body: JSON.stringify({
      error: {
        code: 401,
        message: "Invalid Credentials",
        details: {},
      },
    }),
  };
};
