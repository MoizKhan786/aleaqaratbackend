#!/bin/bash

# List of Lambda function names
lambda_functions=("CreatePropertyFunction" "DeletePropertyFunction" "GenerateTokenFunction" "GetPropertyFunction" "LoginUserFunction" "RegisterUserFunction" "UpdatePropertyFunction" "VerifyTokenFunction")

# Remove handler
rm -rf handlers.zip

# Zip the Lambda function code
zip -r handlers.zip .

# Path to the new Lambda function code
code_path="handlers.zip"

# AWS Region
aws_region="us-east-1"

# Iterate over Lambda functions
for function_name in "${lambda_functions[@]}"; do
    echo "Updating code for Lambda function: $function_name"

    # Update Lambda function code
    aws lambda update-function-code \
        --function-name "$function_name" \
        --region "$aws_region" \
        --zip-file "fileb://$code_path" &

    wait $!

    echo "Code updated for Lambda function: $function_name"
done

echo "All Lambda functions updated."
