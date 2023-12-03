const {
  verifyAccessToken,
} = require("./auth/jwtGeneration");

exports.handler = async (event) => {
  try {
    const { token } = event;

    try {
      const decodedToken = verifyAccessToken(token);

      return {
        statusCode: 200,
        headers: response_headers,
        body: JSON.stringify({ decodedToken }),
      };
    } catch (error) {
      return {
        statusCode: 401,
        headers: response_headers,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: response_headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};