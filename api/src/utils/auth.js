module.exports.authCheck = (event) => {
  if (
    event.headers &&
    (event.headers.authorization !== "Bearer dummy-jwt-token" &&
      event.headers.Authorization !== "Bearer dummy-jwt-token")
  ) {
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
