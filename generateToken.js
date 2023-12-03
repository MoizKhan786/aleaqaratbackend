const {
  generateAccessToken,
} = require("./auth/jwtGeneration");

exports.handler = async (event) => {
    try {
      const { email, username } = JSON.parse(event.body);; 
  
      const token = generateAccessToken(email, username);
  
      return {
        statusCode: 200,
        body: JSON.stringify({ token }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  };