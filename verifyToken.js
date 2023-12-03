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
        body: JSON.stringify({ decodedToken }),
      };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};