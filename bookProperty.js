const { verifyAccessToken } = require("./auth/jwtGeneration");
const { assumeRole } = require("./auth/assumeLabRole");
const { getPropertyManagerClient } = require("./client/property");
const { response_headers } = require('./constants')

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
    const { propertyID, toDate, fromDate } = JSON.parse(event.body);
    const credentials = await assumeRole();

    console.log("Assume role successful");

    const propertyToBook = await getPropertyManagerClient(
      credentials
    ).bookProperty(propertyID, toDate, fromDate, decodedToken.email);

    return {
      statusCode: 200,
      headers: response_headers,
      body: JSON.stringify({
        propertyToBook,
        message: "Property Booked successfully",
      }),
    };
  } catch (error) {
    console.error(error);
    if (error.message.includes("Invalid token")) {
      return {
        statusCode: 401,
        headers: response_headers,
        body: JSON.stringify({ error: "Unauthorized - Invalid token" }),
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
