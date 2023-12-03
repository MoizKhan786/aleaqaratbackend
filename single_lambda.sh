#!/bin/bash

# function_name="CreatePropertyFunction"
# function_name="DeletePropertyFunction"
# function_name="GenerateTokenFunction"
# function_name="GetPropertyFunction"
# function_name="LoginUserFunction"
# function_name="RegisterUserFunction"
# function_name="UpdatePropertyFunction"
# function_name="VerifyTokenFunction"

# Check if at least two arguments are provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <function_name>"
    exit 1
fi

function_name=$1

# Remove handler
rm -rf handlers.zip

# Zip the Lambda function code
zip -r handlers.zip .

# Path to the new Lambda function code
code_path="handlers.zip"

aws_region="us-east-1"

# Update Lambda function code
aws lambda update-function-code \
    --function-name "$function_name" \
    --region "$aws_region" \
    --zip-file "fileb://$code_path"