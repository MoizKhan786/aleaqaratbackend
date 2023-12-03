const AWS = require('aws-sdk')

const assumeRole = async () => {
    const sts = new AWS.STS({region: "us-east-1"});
  
    const params = {
      RoleArn: 'arn:aws:iam::553435386892:role/LabRole',
      RoleSessionName: 'AssumeRoleSession',
    };
  
    try {
      const data = await sts.assumeRole(params).promise();
      return data.Credentials;
    } catch (err) {
      console.error('Error assuming role:', err);
      throw err;
    }
  }

  module.exports = {
    assumeRole
  }