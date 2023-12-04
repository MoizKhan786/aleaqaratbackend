const AWS = require('aws-sdk')
const { getDBClient } = require('./db')
const PropertyManager = require("property-manager-for-aws");
const { property_table, property_image_bucket, sns_topic } = require('../constants')

// Function to create property client using s3, sns and ddb client
const getPropertyManagerClient = (credentials) => {
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken
},
    region: "us-east-1",
  });
  const sns = new AWS.SNS({
    credentials: {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken
    },
    region: "us-east-1",
  });
  const propertyManagerClient = new PropertyManager({
    client: getDBClient(credentials),
    tableName: property_table,
    bucketName: property_image_bucket,
    keyPrefix: "images",
    s3,
    sns,
    snsTopicArn: sns_topic,
  });

  return propertyManagerClient;
}

module.exports = {
  getPropertyManagerClient
}