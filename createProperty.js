const {
  verifyAccessToken,
} = require("./auth/jwtGeneration");
const {
  assumeRole
} = require('./auth/assumeLabRole');
const { getPropertyManagerClient } = require('./client/property');

exports.handler = async (event) => {
  try {
    const authorizationHeader = event.headers["Authorization"];

    if (!authorizationHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized - Missing token" }),
      };
    }

    const [, token] = authorizationHeader.split(" ");
    const decodedToken = verifyAccessToken(token);
    const { propertyData, imageFile } = JSON.parse(event.body);
    const credentials = await assumeRole();

    console.log("Assume role successful");

    const propertyId = await getPropertyManagerClient(credentials).createProperty(
      propertyData,
      imageFile,
      decodedToken.email
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ propertyId, message: "Property created successfully" }),
    };
  } catch (error) {
    console.error(error);
    if (error.message.includes("Invalid token")) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized - Invalid token" }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  }
};

