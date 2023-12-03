const {
  generateAccessToken,
} = require("./auth/jwtGeneration");
const { response_headers } = require('./constants')

exports.handler = async (event) => {
    try {
      const { email, username } = JSON.parse(event.body);
  
      const token = generateAccessToken(email, username);
  
      return {
        statusCode: 200,
        headers: response_headers,
        body: JSON.stringify({ token }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        headers: response_headers,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  };