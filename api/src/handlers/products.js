"use strict";

const { authCheck } = require("../utils/auth");
const { PRODUCT_LIST } = require("../data/products");

module.exports.listProducts = async (event) => {
  console.log("List products event:", JSON.stringify(event, null, 2));

  const authError = authCheck(event);
  if (authError) {
    return authError;
  }
  
  const qs = event.queryStringParameters || {};
  const page = parseInt(qs.page || "1", 10);
  const pageSize = parseInt(qs.pageSize || "20", 10);

  // filtering logic omitted for brevity – just return the whole list
  const items = PRODUCT_LIST.slice((page - 1) * pageSize, page * pageSize);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items,
      page,
      pageSize,
      total: PRODUCT_LIST.length,
    }),
  };
};

module.exports.getProduct = async (event) => {
  console.log("Get product event:", JSON.stringify(event, null, 2));

  const authError = authCheck(event);
  if (authError) {
    return authError;
  }

  const id = event.pathParameters && event.pathParameters.id;
  const product = PRODUCT_LIST.find((p) => p.id === id);

  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify({
      error: {
        code: 404,
        message: "Product not found",
        details: {id: id || null},
      },
    }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};
