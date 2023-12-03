const AWS = require('aws-sdk')

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