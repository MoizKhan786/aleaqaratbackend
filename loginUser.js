const AWS = require('aws-sdk')
const bcrypt = require("bcryptjs");
const { users_table, users_table_index, response_headers } = require('./constants');
const {
  generateAccessToken,
} = require("./auth/jwtGeneration");
const {
  assumeRole
} = require('./auth/assumeLabRole')

//use this for login page
exports.handler = async (event) => {
  try {
    const credentials = await assumeRole();

    const dynamoDB = new AWS.DynamoDB.DocumentClient({
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretAccessKey,
        sessionToken: credentials.SessionToken
      },
      region: 'us-east-1'
    });

    const { email, password } = JSON.parse(event.body);

    const user = await getUserByEmail(dynamoDB, email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        statusCode: 401,
        headers: response_headers,
        body: JSON.stringify({ error: "Invalid email or password" }),
      };
    }

    const token = await generateAccessToken(user.email, user.username);

    return {
      statusCode: 200,
      headers: response_headers,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: response_headers,
      body: JSON.stringify({ error: "Internal server error" }),
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

  