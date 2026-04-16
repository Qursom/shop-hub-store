module.exports.authCheck = (event) => {
  const authHeader = event?.headers?.authorization || event?.headers?.Authorization;

  if (authHeader !== "Bearer dummy-jwt-token") {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: {
          code: 401,
          message: "Unauthorized - Invalid or missing token",
          details: {},
        },
      }),
    };
  }
};
