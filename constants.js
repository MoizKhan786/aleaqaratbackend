exports.users_table = "UsersTable"
exports.property_table = "PropertyTable"
exports.users_table_index = "email-index"
exports.lab_role_arn = "arn:aws:iam::553435386892:role/LabRole"
exports.role_session_name = "AssumeRoleSession"
exports.property_image_bucket = "propertyimagebucket"
exports.sns_topic = "arn:aws:sns:us-east-1:553435386892:PropertyTopic.fifo"
exports.response_headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE, PUT',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Credentials': 'true'
}