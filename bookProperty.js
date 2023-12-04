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
        headers: response_headers,
        body: JSON.stringify({ error: "Unauthorized - Missing token" }),
      };
    }

    const { propertyId } = event.queryStringParameters;

    const [, token] = authorizationHeader.split(" ");
    const decodedToken = verifyAccessToken(token);
    const { toDate, fromDate } = JSON.parse(event.body);
    const credentials = await assumeRole();

    console.log("Assume role successful");

    const propertyToBook = await getPropertyManagerClient(
      credentials
    ).bookProperty(propertyId, fromDate, toDate, decodedToken.email);

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
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};
