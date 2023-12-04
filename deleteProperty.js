const {
  verifyAccessToken,
} = require("./auth/jwtGeneration");
const {
  assumeRole
} = require('./auth/assumeLabRole')
const { getPropertyManagerClient } = require('./client/property')
const { response_headers } = require('./constants')

// This lambda handler is used to delete the property.
// Property not found message is thrown when someone tries to delete the property and it doesn't exist
exports.handler = async (event) => {
  try {
    const { propertyId } = event.queryStringParameters;

    const authorizationHeader = event.headers["Authorization"];
    if (!authorizationHeader) {
      return {
        statusCode: 401,
        headers: response_headers,
        body: JSON.stringify({ error: "Unauthorized - Missing token" }),
      };
    }

    const [, token] = authorizationHeader.split(" ");
    const decodedToken = verifyAccessToken(token);
    const credentials = await assumeRole();
    await getPropertyManagerClient(credentials).deleteProperty(
      propertyId,
      decodedToken.email
    );

    return {
      statusCode: 200,
      headers: response_headers,
      body: JSON.stringify({ message: "Property deleted successfully" }),
    };
  } catch (error) {
    console.error(error);
    if (error.message.includes("Invalid token")) {
      return {
        statusCode: 401,
        headers: response_headers,
        body: JSON.stringify({ error: "Unauthorized - Invalid token" }),
      };
    } else if (error.message.includes("Property not found")){
      return {
        statusCode: 404,
        headers: response_headers,
        body: JSON.stringify({ error: error.message }),
      };
    } else {
      return {
        statusCode: 500,
        headers: response_headers,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  }
};
