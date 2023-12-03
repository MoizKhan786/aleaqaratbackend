const { verifyAccessToken } = require("./auth/jwtGeneration");
const { assumeRole } = require("./auth/assumeLabRole");
const { getPropertyManagerClient } = require("./client/property");

exports.handler = async (event) => {
  console.info(event);
  try {
    const authorizationHeader = event.headers["Authorization"];
    if (!authorizationHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized - Missing token" }),
      };
    }

    const [, token] = authorizationHeader.split(" ");

    verifyAccessToken(token);

    const credentials = await assumeRole();
    const properties = await getPropertyManagerClient(
      credentials
    ).getAllProperties();

    if (!properties) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No Properties Found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ properties }),
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
