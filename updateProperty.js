const {
  verifyAccessToken,
} = require("./auth/jwtGeneration");
const {
  assumeRole
} = require('./auth/assumeLabRole')
const { getPropertyManagerClient } = require('./client/property')
const { response_headers } = require('./constants');

// This handler is used to update a given property.
exports.handler = async (event) => {
  try {
    const { propertyId } = event.queryStringParameters;
    const { updatedData } = JSON.parse(event.body);

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
    await getPropertyManagerClient(credentials).updateProperty(
      propertyId,
      updatedData,
      decodedToken.email
    );

    return {
      statusCode: 200,
      headers: response_headers,
      body: JSON.stringify({ message: "Property updated successfully" }),
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
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};
