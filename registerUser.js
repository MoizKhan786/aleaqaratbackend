const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { users_table, users_table_index } = require("./constants");
const { assumeRole } = require("./auth/assumeLabRole");
const { getDBClient } = require("./client/db");

//use this for register page
exports.handler = async (event) => {
  try {
    const credentials = await assumeRole();
    const dynamoDB = getDBClient(credentials);

    const { firstName, lastName, email, password } = JSON.parse(event.body);
    const existingUser = await getUserByEmail(dynamoDB, email);

    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User with this email already exists" }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    await createUser(dynamoDB, firstName, lastName, email, hashedPassword);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User registered successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
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
