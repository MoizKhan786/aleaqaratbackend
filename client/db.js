const AWS = require('aws-sdk')

// Function to created DDB client using users credentials
const getDBClient = (credentials) => {
    const dbClient = new AWS.DynamoDB.DocumentClient({
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretAccessKey,
        sessionToken: credentials.SessionToken,
        region: "us-east-1",
    });
    return dbClient
}

module.exports = {
    getDBClient
}