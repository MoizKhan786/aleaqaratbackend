const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { users_table, users_table_index, response_headers } = require('./constants');
const { assumeRole } = require('./auth/assumeLabRole');
const { getDBClient } = require('./client/db')

// This handler is used to register a user. For existing user appropriate message will be shown
exports.handler = async (event) => {
  try {
    const credentials = await assumeRole();
    const dynamoDB = getDBClient(credentials);

    const { firstName, lastName, email, password } = JSON.parse(event.body);
    const existingUser = await getUserByEmail(dynamoDB, email);

    if (existingUser) {
      return {
        statusCode: 400,
        headers: response_headers,
        body: JSON.stringify({ error: "User with this email already exists" }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    await createUser(dynamoDB, firstName, lastName, email, hashedPassword);

    console.log("Before successful response")

    return {
      statusCode: 200,
      headers: response_headers,
      body: JSON.stringify({ message: "User registered successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: response_headers,
      body: JSON.stringify({ event: event, error: "Internal server error" }),
    };
  }
};

async function getUserByEmail(dynamoDB, email) {
  const params = {
    TableName: users_table,
    IndexName: users_table_index,
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  const result = await dynamoDB.query(params).promise();

  return result.Items.length > 0 ? result.Items[0] : null;
}

async function createUser(dynamoDB, firstName, lastName, email, password) {
  const params = {
    TableName: users_table,
    Item: {
      firstName,
      lastName,
      email,
      password,
    },
  };

  await dynamoDB.put(params).promise();
}
