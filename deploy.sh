#!/bin/bash

# Usage sh deploy.sh. This file helps to upload the code to s3 and deploys lambda and apigateway.

# SAM build
sam build

# Remove handler
rm -rf handlers.zip

# S3 Object Deletion
## List all objects in the bucket
objects=$(aws s3api list-objects-v2 --bucket realeastelambdahanldercode --query 'Contents[].{Key: Key}' --output json --region us-east-1)

## Check if there are any objects
if [ "$(echo $objects | jq length)" -eq "0" ]; then
  echo "No objects found in the bucket."
  # exit 0
fi

## Loop through and delete each object
for key in $(echo $objects | jq -r '.[].Key'); do
  aws s3api delete-object --bucket realeastelambdahanldercode --key $key --region us-east-1
  echo "Deleted object: $key"
done

echo "All objects deleted successfully."

# Remove file from s3
aws s3 rm s3://realeastelambdahanldercode/handlers.zip

# Delete the existing CloudFormation stack
# aws cloudformation delete-stack --stack-name my-serverless-app --region us-east-1

# Wait for the stack deletion to complete
# aws cloudformation wait stack-delete-complete --stack-name my-serverless-app --region us-east-1

# Zip the Lambda function code
zip -r handlers.zip .

# Upload the zip file to S3
aws s3 cp handlers.zip s3://realeastelambdahanldercode/handlers.zip

# Deploy the serverless application using AWS SAM
sam deploy --stack-name my-serverless-app --region us-east-1 --s3-bucket realeastelambdahanldercode